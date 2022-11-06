const { Client, GatewayIntentBits, Emoji } = require('discord.js');
require('dotenv').config();

const database = require('./database');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

client.once('ready', () => console.log('Ready!'));

client.on('messageCreate', (message) => {
  if (message.content.includes('dn')) {
    message.react('🍆');
    message.react('💦');
    return message.reply('deez nuts haha gotem');
  }

  if(message.content.toLowerCase().includes('who') && message.content.toLowerCase().includes('joe')) {
    return message.reply('Joe mama haha gotem');
  }

  if (message.content === '!help') {
    return message.reply("there's no help lmao");
  }

  if(message.author.id == '195278304700399616') {
    return message.react("🐒")
  }
});

client.login(process.env.TOKEN);