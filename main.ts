import { Client, GatewayIntentBits, Emoji, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

import {
  addWordToDB,
  getWordCount,
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
} from './database';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => console.log('Ready!'));

const helpEmbed = new EmbedBuilder()
  .setTitle('Cringe Bot')
  .addFields(
    { name: '!help', value: 'Display this page' },
    { name: '!roast <username>', value: 'Get roasted/Roast someone' },
    {
      name: '!leetcode <username>',
      value: 'Assign LeetCode username to your discord',
    },
    { name: '!flex', value: 'Show LeetCode stats' },
    { name: '!weather', value: 'Display current weather' },
    { name: '!pointless', value: 'idk, some pointless stuff' }
  )
  .setTimestamp();

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

    if (split.length > 1 && !isNaN(split[1] as any)) limit = parseInt(split[1]);

    message.reply(await getWordCount(limit));
  }
  if (message.content === '!help') {
    message.channel.send({ embeds: [helpEmbed] });
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

  if (message.author.username === 'gator') {
    message.react('🐊');
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

  if (message.content === '!weather') {
    const start = new Date(Date.UTC(2022, 10, 11, 22));
    const today = Date.now();

    const dif = Math.floor((today - start.getTime()) / (1000 * 3600)); // # hours

    message.reply(
      `We have been waiting ${dif} hour${
        dif <= 1 ? '' : 's'
      } for <@576880753200070666> to implement this feature 😠`
    );
  }

  if (message.content.startsWith('!roast')) {
    const roast = await getRoast();
    if (message.content.trim() === '!roast') {
      message.channel.send(roast);
    } else {
      const target = message.content.split(' ')[1];
      console.log(target);
      message.channel.send(`${target}, ${roast}`);
    }
  }

  if (message.content == '!secret') {
    message.channel.send('tg simon');
  }
});

client.login(process.env.TOKEN);
