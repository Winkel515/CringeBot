const { Client, GatewayIntentBits, Emoji } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const {
  addWordToDB,
  getWordCount,
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
} = require('./database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => console.log('Ready!'));

const getLeetcodeData = async (username) => {
  const res = await axios.get(
    `https://leetcode-stats-api.herokuapp.com/${username}`
  );
  if (res.data.status === 'error') {
    return null;
  }
  return (
    `Total Solved: ${res.data.totalSolved}\n` +
    `\tEasy: ${res.data.easySolved}\n` +
    `\tMedium: ${res.data.mediumSolved}\n` +
    `\tHard: ${res.data.hardSolved}\n` +
    `Ranking: ${res.data.ranking}`
  );
};

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.trim().charAt(0) != '!') addWordToDB(message.content);

  if (message.content.trim().substring(0, '!analysis'.length) === '!analysis') {
    const split = message.content.split(' ');
    let limit = 10;

    if (split.length > 1 && !isNaN(split[1])) limit = parseInt(split[1]);

    message.reply(await getWordCount(limit));
  }

  if (message.content.toLowerCase().includes('dn')) {
    message.react('🍆');
    message.react('💦');
    message.reply('deez nuts haha gotem');
  }

  if (message.content.trim() === 'test') {
    message.react('🧐');
  }

  if (
    message.content.toLowerCase().includes('who') &&
    message.content.toLowerCase().includes('joe')
  ) {
    message.reply('Joe mama haha gotem');
  }

  if (message.author.id === '195278304700399616') {
    message.react('🐒');
  }

  if (message.author.username === 'saamenerve') {
    message.react('🤓');
  }

  if (message.author.username === 'wugway') {
    message.react('🍆');
  }

  if (message.content.startsWith('!leetcode')) {
    const strArr = message.content.split(' ');
    if (strArr.length <= 1) {
      message.reply('what the fuck bro, where username');
    } else {
      try {
        await addLeetcodeUser(message.author.id, strArr[1]);
        message.react('✅');
      } catch (err) {
        console.log(err.stack);
        message.react('❌');
      }
    }
  }
  if (message.content.trim() === '!flex') {
    const username = await getLeetcodeUser(message.author.id);
    if (username === null) {
      message.reply(
        "I don't know your leetcode username bro, use !leetcode <username>"
      );
    } else {
      const data = await getLeetcodeData(username);
      if (!data) {
        message.reply(`"${username}" LeetCode account does not exist`);
      } else {
        message.reply(data);
      }
    }
  }

  if (message.content === '!pointless') {
    message.reply(
      new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
      })
    );
  }
  if (message.content.startsWith('!roast')) {
    const roast = await getRoast();
    if (message.content.trim() === '!roast') {
      message.channel.send(roast);
    } else {
      const target = message.content.split(' ')[1];
      message.channel.send(`${target}, ${roast}`);
    }
  }
});

client.login(process.env.TOKEN);
