const e = require('http-errors');

const makeApiCall = (app, url, method, fn) =>
{
	if (typeof fn === typeof eval)
	{
		app[method.toLowerCase()](url, (req, res, next) =>
		{
			return Promise.resolve(fn(req, res))
				.then(result => {
					res.json(result);
				})
				.catch((err) => {
					if (err instanceof e.HttpError)
					{
						res.status(err.status);
						res.json({ error: true, message: err.message });
					}
					else
						next(e(500, 'Internal Server Error'));
				})
			;
		});
	}
};

const makeApiHelper = (app, urlRegex, fns, method) =>
{
	makeApiCall(app, urlRegex, fns[method], method.toLowerCase());
};
const makeApi = (app, root, obj) =>
{
	for (let key in obj)
	{
		if (!obj.hasOwnProperty(key)) continue;
		let entity = obj[key];
		if (typeof entity.create === typeof eval)
		{
			makeApiCall(app, `${root}/${key}`, 'POST', (req, res) =>
			{
				return entity.create(req.body);
			});
		}
		if (typeof entity.list === typeof eval)
		{
			makeApiCall(app, `${root}/${key}`, 'GET', (req, res) =>
			{
				return entity.list(req.body);
			});
		}
		if (typeof entity.get === typeof eval)
		{
			makeApiCall(app, `${root}/${key}/:id`, 'GET', (req, res) =>
			{
				return entity.get(req.params.id);
			});
		}
		if (typeof entity.update === typeof eval)
		{
			makeApiCall(app, `${root}/${key}/:id`, 'POST', (req, res) =>
			{
				return entity.update(req.params.id, req.body);
			});
		}
		if (typeof entity.delete === typeof eval)
		{
			makeApiCall(app, `${root}/${key}/:id`, 'DELETE', (req, res) =>
			{
				return entity.delete(req.params.id);
			});
		}
	}
};

module.exports = makeApi;
