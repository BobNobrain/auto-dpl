const mysql = require('mysql');
const errors = require('http-errors');
const config = require('./config.js');

const noop = () => void 0;
const padZero = n => +n >= 10? n + '' : '0' + n;
const dateToMysql = d => {
	return [
		d.getFullYear(),
		padZero(d.getMonth() + 1),
		padZero(d.getDate())
	].join('-');
};

const isTimeInPast = (date, timeId) =>
{
	let n = new Date();
	if (date.getTime() < n.getTime())
	{
		// today or past?
		if (date.getDate() === n.getDate() &&
			date.getMonth() === n.getMonth() &&
			date.getFullYear() === n.getFullYear())
		{
			// today
			let hour = 60*60*1000;
			let time = (timeId - 1 + 8) * hour;
			if (time > 12 * hour) // мужчина, вы не видите, у нас обед!
				time += hour;

			time += date.getTime();
			if (time <= n.getTime())
				return true; // today, but in the past
			else
				return false;
		}
		else
		{
			// in the past
			return true;
		}
	}
	else
	{
		return false;
	}
};



// promises
const connect = (cfg) => new Promise(function (rs, rj)
{
	const conn = mysql.createConnection({
		host     : cfg.host,
		port     : cfg.port,
		user     : cfg.user,
		password : cfg.password,
		database : cfg.database
	});
	conn.connect(err => err? rj(err) : rs(conn));
});

const query = (conn, q, v) => new Promise((rs, rj) =>
{
	conn.query(q, v, (e, r, f) =>
	{
		if (e) rj(e);
		rs(r, f);
	});
});

const makeValues = (schema, dict, idName) => schema.map(column => column === idName? 0 : dict[column]);
const makeInsertPlaceholders = schema => new Array(schema.length).join('?, ') + '?';
const makeUpdates = (schema, dict) =>
{
	return schema
		.map(column =>
		{
			if (dict.hasOwnProperty(column))
				return `${column} = ?`;
			else return '';
		})
		.join(', ')
	;
};
const makeUpdateValues = (schema, dict) =>
{
	return schema
		.reduce((acc, column) =>
		{
			if (dict.hasOwnProperty(column))
				acc.push(dict[column]);
			return acc;
		}, []);
};

const connectAndQuery = (queryString, values) =>
{
	let conn = null;
	return connect(config.db)
		.then(c => {
			conn = c;
			return query(c, queryString, values)
		})
		.catch(e =>
		{
			console.error(e);
			conn.end();
			throw e;
		})
	;
};

const makeCRUD = (table, schema, idIndex = 0) =>
{
	const idName = schema[idIndex]; // name of primary key column
	return {
		'get': (id) =>
		{
			return connectAndQuery(`SELECT * FROM ${table} WHERE ${idName} = ? LIMIT 1`, [id])
				.then(r =>
				{
					if (r.length) return r[0];
					else throw new errors.NotFound();
				})
			;
		},
		'list': () =>
		{
			return connectAndQuery(`SELECT * FROM ${table}`)
				.then(r => [...r])
			;
		},
		'create': (params) =>
		{
			return connectAndQuery(
				`INSERT INTO ${table} VALUES(${makeInsertPlaceholders(schema)})`,
				makeValues(schema, params, idName)
			)
				.then(r => ({ success: true, id: r.insertId }));
		},
		'update': (id, params) =>
		{
			return connectAndQuery(
				`UPDATE ${table} SET ${makeUpdates(schema, params)} WHERE ${idName} = ?`,
				makeUpdateValues(schema, params).concat([id])
			)
				.then(r => ({ success: true, updated: r.affectedRows }));
		},
		'delete': (id) =>
		{
			return connectAndQuery(
				`DELETE FROM ${table} WHERE ${idName} = ?`,
				[id]
			)
				.then(r => ({ success: true, id, deleted: r.affectedRows }));
		}
	};
};

module.exports = {
	'test': {
		get: (id) => Promise.resolve({ id, name: '#' + id }),
		list: () => [1, 2, 3],
		'GET': (req, res) =>
		{
			let conn = null;
			return connect(config.db)
				.then(c => {
					conn = c;
					return query(c, 'SELECT 2+2 AS four');
				})
				.then((results, fields) =>
				{
					res.json('2+2 = ' + results[0].four);
				})
				.catch(err => handleErr(err, true, res))
				.then(() => conn.end())
			;
		}
	},
	[config.api.car]: makeCRUD('cars',
		'car_id car_number region produced_at model akkp gur'.split(' ')),

	[config.api.group]: makeCRUD('groups',
		'group_id group_number begin_date end_date'.split(' ')),

	[config.api.student]: makeCRUD('students',
		'student_id surname name third_name birthday passport_number snils sex group_id'.split(' ')),

	[config.api.teacher]: makeCRUD('teachers',
		'teacher_id surname name third_name birthday teacher_role experience car_id'.split(' '))
};
