import { Client, GatewayIntentBits, Emoji, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';
import {
  addWordToDB,
  getWordCount,
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
} from './database';
import { useCommand } from './commands';

dotenv.config();

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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.trim().charAt(0) != '!') addWordToDB(message.content);

  if (message.content.trim().substring(0, '!analysis'.length) === '!analysis') {
    const split = message.content.split(' ');
    let limit = 10;

    if (split.length > 1 && !isNaN(split[1] as any)) limit = parseInt(split[1]);

    message.reply(await getWordCount(limit));
  }

  useCommand(message);

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
});

client.login(process.env.TOKEN);
