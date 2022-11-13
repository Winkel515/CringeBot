import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { addWordToDB } from './database';
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

client.once('ready', () => console.log('CringeBot is ready!'));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  addWordToDB(message.content);

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

  if (message.author.id === '294616941870710784') {
    message.react('🤓');
  }

  if (message.author.id === '576880753200070666') {
    message.react('🍆');
  }

  if (message.author.id === '706649359600713750') {
    message.react('🐊');
  }
});

client.login(process.env.TOKEN);
