const { Client, GatewayIntentBits, Emoji } = require('discord.js');
const axios = require('axios');
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

	if(message.content.trim().charAt(0) != '!')
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
		message.reply('deez nuts haha gotem dn');
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
		if(message.content.trim() === '!flex') {
			const res = await axios.get('https://leetcode-stats-api.herokuapp.com/Winkel515');
			message.reply(`Total Solved: ${res.data.totalSolved}\n` +
			`\tEasy: ${res.data.easySolved}\n` + 
			`\tMedium: ${res.data.mediumSolved}\n` +
			`\tHard: ${res.data.hardSolved}\n` +
			`Ranking: ${res.data.ranking}`
			)
		}
		message.react('🐒');
	}

	if (message.author.username === 'saamenerve') {
		message.react('🤓');
	}

	if (message.author.username === 'wugway') {
		message.reply('tg simon');
	}

	if(message.author.username === 'normalman68') {
		message.react('🤡');
	}
});

client.login(process.env.TOKEN);
