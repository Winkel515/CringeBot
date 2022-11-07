const pg = require('pg');
require('dotenv').config();

const client = new pg.Client(process.env.PG_URL);

client.connect(function (err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}
	console.log('Connected to Postgres DB.');
});

const addWordToDB = (input) => {
	let strArr = input.split(' ');

	strArr = strArr.map((str) => {
		return str.replace(/[^A-Za-z0-9]|[^A-Za-z0-9]/g, '');
	});

	console.log(strArr);
};

module.exports = { addWordToDB };
