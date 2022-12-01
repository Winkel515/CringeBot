import pg from 'pg';
import 'dotenv/config';

const client = new pg.Pool();

// client.connect(function (err) {
//   if (err) {
//     return console.error('could not connect to postgres', err);
//   }
//   console.log('Connected to Postgres DB.');
// });

const addWordToDB = async (input: string) => {
  const strArr = input
    .toLowerCase()
    .split(' ')
    .map((str) => {
      return str.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
    })
    .filter((str) => str.length != 0);

  type StrCount = {
    [key: string]: number;
  };

  const strCount: StrCount = {};

  for (const str of strArr) {
    if (strCount[str] === undefined) {
      strCount[str] = 1;
    } else {
      strCount[str]++;
    }
  }

  for (const [str, count] of Object.entries(strCount)) {
    const selectQuery = 'SELECT word, frequency FROM words WHERE word = $1';
    const selectValues = [str];

    try {
      const res = await client.query(selectQuery, selectValues);

      if (res.rowCount === 0) {
        const insertQuery =
          'INSERT INTO words (word, frequency) VALUES ($1, $2)';
        const insertValues = [str, count];
        client.query(insertQuery, insertValues);
      } else {
        const updateQuery = 'UPDATE words SET frequency = $1 WHERE word = $2';
        const updateValues = [count + res.rows[0].frequency, str];
        client.query(updateQuery, updateValues);
      }
    } catch (err) {
      console.log('Word Count Error:', err.stack);
    }
  }
};

const getWordCount = async (limit: number) => {
  const selectQuery =
    'SELECT word, frequency FROM words ORDER BY frequency DESC LIMIT $1';
  const selectValues = [Math.min(50, limit)];
  const res = await client.query(selectQuery, selectValues);

  let str = '';

  for (const [index, row] of res.rows.entries())
    str += `${index + 1}. ${row.word}: ${row.frequency}\n`;

  return str;
};

const addLeetcodeUser = async (discordId: string, username: string) => {
  const selectQuery =
    'SELECT discord_id, username FROM leetcode WHERE discord_id = $1';
  const selectValues = [discordId];
  try {
    const res = await client.query(selectQuery, selectValues);
    if (res.rowCount === 0) {
      const insertQuery =
        'INSERT INTO leetcode (discord_id, username) VALUES ($1, $2)';
      const insertValues = [discordId, username];
      client.query(insertQuery, insertValues);
    } else {
      const updateQuery =
        'UPDATE leetcode SET username = $1 WHERE discord_id = $2';
      const updateValues = [username, discordId];
      client.query(updateQuery, updateValues);
    }
  } catch (err) {
    console.log(err.stack);
  }
};

const getLeetcodeUser = async (discordId: string) => {
  const selectQuery = 'SELECT username FROM leetcode WHERE discord_id = $1';
  const selectValues = [discordId];
  const res = await client.query(selectQuery, selectValues);
  if (res.rowCount === 0) {
    return null;
  } else {
    return res.rows[0].username;
  }
};

const getRoast = async () => {
  const selectQuery = 'SELECT roast FROM roasts ORDER BY RANDOM() LIMIT 1';
  const res = await client.query(selectQuery);
  try {
    if (res.rowCount === 0) {
      return null;
    } else {
      return res.rows[0].roast;
    }
  } catch (err) {
    console.log(err.stack);
    return null;
  }
};

const getDeezNutsCount = async (discordId: string) => {
  const selectQuery = 'SELECT count FROM dn_counts WHERE discord_id = $1';
  const selectValues = [discordId];
  const res = await client.query(selectQuery, selectValues);
  try {
    if (res.rowCount === 0) {
      return '0';
    } else {
      return res.rows[0].count;
    }
  } catch (err) {
    console.log(err.stack);
  }
};

const addDeezNutsCount = async (discordId: string) => {
  const selectQuery = 'SELECT count FROM dn_counts WHERE discord_id = $1';
  const selectValues = [discordId];
  const res = await client.query(selectQuery, selectValues);
  try {
    if (res.rowCount === 0) {
      const insertQuery =
        'INSERT INTO dn_counts (discord_id, count) VALUES ($1, $2)';
      const insertValues = [discordId, 1];
      client.query(insertQuery, insertValues);
    } else {
      const updateQuery =
        'UPDATE dn_counts SET count = $2 WHERE discord_id = $1';
      const updateValues = [discordId, parseInt(res.rows[0].count) + 1];
      client.query(updateQuery, updateValues);
    }
  } catch (err) {
    console.log(err.stack);
    return;
  }
};
const handleCount = async (num: number): Promise<boolean> => {
  const selectQuery = "SELECT value FROM count WHERE lock = 'X'";
  const res = await client.query(selectQuery);
  const isNextNum = num === res.rows[0].value + 1;
  const updateQuery = "UPDATE count SET value = $1 WHERE lock = 'X'";
  const updateValues = isNextNum ? [num] : [0];
  client.query(updateQuery, updateValues);
  return isNextNum;
};

export {
  addWordToDB,
  getWordCount,
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
  addDeezNutsCount,
  getDeezNutsCount,
  handleCount,
};
