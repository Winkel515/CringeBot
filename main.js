const { Client, GatewayIntentBits, Emoji } = require('discord.js');
require('dotenv').config();

const { addWordToDB, getWordCount } = require('./database');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.once('ready', () => console.log('Ready!'));

client.on('messageCreate', async (message) => {
	if(message.author.bot)
		return

	addWordToDB(message.content);

	if(message.content.trim().substring(0, '!analysis'.length) === '!analysis') {
		const split = message.content.split();
		let limit = 10;

		if(split.length > 1)
			limit = parseInt(split[1]);

		message.reply(await getWordCount(limit));
	}

	if (message.content.toLowerCase().includes('dn')) {
		message.react('🍆');
		message.react('💦');
		return message.reply('deez nuts haha gotem dn');
	}

	if (message.content.trim() === 'test') {
		return message.react('🧐');
	}

	if (
		message.content.toLowerCase().includes('who') &&
		message.content.toLowerCase().includes('joe')
	) {
		return message.reply('Joe mama haha gotem');
	}

	if (message.content === '!help') {
		return message.reply("there's no help lmao");
	}

	if (message.author.id === '195278304700399616') {
		return message.react('🐒');
	}

	if (message.author.username === 'saamenerve') {
		return message.react('🤓');
	}

	if (message.author.username === 'wugway') {
		return message.reply('tg simon');
	}

	if(message.author.username === 'normalman68') {
		return message.react('🤡');
	}
});

client.login(process.env.TOKEN);
