const dbip = process.env['DBIP'];
const dbuser = process.env['DBUSER'];
const dbpass = process.env['DBPASS'];

if (!dbip)
	console.error('Error! Environment variable DBIP is not set. Cannot enstablish connection to DB!');
if (!dbuser)
	console.error('Error! Environment variable DBUSER is not set. Cannot enstablish connection to DB!');
if (!dbpass)
	console.error('Error! Environment variable DBPASS is not set. Cannot enstablish connection to DB!');

module.exports = {
	db: {
		host: dbip,
		port: 3306,
		user: dbuser,
		password: dbpass,
		database: 'prod'
	},
	api: {
		root: '/api',
		student: 'student',
		teacher: 'teacher',
		car: 'car',
		group: 'group',
		report: 'report'
	},
	template: {
		converter: 'pandoc %in% -f html -t pdf -o %out%'
	},
	staticRoot: '/',
	staticFolder: './static'
};
