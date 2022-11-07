const pg = require('pg');
require('dotenv').config();

const client = new pg.Client(process.env.PG_URL);

client.connect(function (err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}
	console.log('Connected to Postgres DB.');
});

const addWordToDB = async (input) => {
	const strArr = input.toLowerCase().split(' ')
		.map((str) => {
			return str.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
		})
		.filter(str => str.length != 0);

	const strCount = {};

	for(const str of strArr) {
		if(strCount[str] === undefined) {
			strCount[str] = 1;
		} else {
			strCount[str]++;
		}
	}

	for(const [str, count] of Object.entries(strCount)) {
		const selectQuery = 'SELECT word, frequency FROM words WHERE word = $1';
		const selectValues = [str];

		try {
			const res = await client.query(selectQuery, selectValues);

			if(res.rowCount === 0) {
				const insertQuery = 'INSERT INTO words (word, frequency) VALUES ($1, $2)';
				const insertValues = [str, count];
				client.query(insertQuery, insertValues);
			} else {
				const updateQuery = 'UPDATE words SET frequency = $1 WHERE word = $2';
				const updateValues = [count + res.rows[0].frequency, str];
				client.query(updateQuery, updateValues);
			}
		} catch (err) {
			console.log(err.stack);
		}
	}
};

const getWordCount = async (limit) => {
	const selectQuery = 'SELECT word, frequency FROM words ORDER BY frequency DESC LIMIT $1';
	const selectValues = [Math.min(30, limit)];
	const res = await client.query(selectQuery, selectValues);

	let str = "";

	for(const row of res.rows)
		str += `${row.word}: ${row.frequency}\n`;

	return str;
}

const addLeetcodeUser = async (discordId, username) =>{
	const selectQuery = 'SELECT discord_id, username FROM leetcode WHERE discord_id = $1'
	const selectValues = [discordId]
	try {
		const res = await client.query(selectQuery,selectValues)
		if(res.rowCount === 0) {
			const insertQuery = 'INSERT INTO leetcode (discord_id, username) VALUES ($1, $2)';
			const insertValues = [discordId, username];
			client.query(insertQuery, insertValues);
		} else {
			const updateQuery = 'UPDATE leetcode SET username = $1 WHERE discord_id = $2';
			const updateValues = [username, discordId];
			client.query(updateQuery, updateValues);
		}
	} catch (err) {
		console.log(err.stack);
	}
}

const getLeetcodeUser = async (discordId) => {
	const selectQuery = 'SELECT username FROM leetcode WHERE discord_id = $1'
	const selectValues = [discordId]
	const res = await client.query(selectQuery,selectValues)
	if (res.rowCount === 0){
		return null 
	}
	else{
		return res.rows[0].username
	}
}

module.exports = {addWordToDB, getWordCount, addLeetcodeUser, getLeetcodeUser};
