import { EmbedBuilder, Message, MessageMentions } from 'discord.js';
import axios from 'axios';

import {
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
  getWordCount,
  getDeezNutsCount,
} from './database';

type Commands = {
  [key: string]: (message: Message, param: string) => Promise<void> | void;
};

const commands: Commands = {
  help,
  leetcode,
  pointless,
  weather,
  roast,
  secret,
  flex,
  analysis,
  nutcount,
};

function useCommand(message: Message) {
  let [command, param] = message.content.split(' ');
  if (command.charAt(0) != '!') return;
  command = command.substring(1);
  if (commands[command]) commands[command](message, param);
}

// Utility functions

const getLeetcodeData = async (username) => {
  const res = await axios.get(
    `https://leetcode-stats-api.herokuapp.com/${username}`
  );
  if (res.data.status === 'error') {
    return null;
  }
  return (
    `User: ${username}\n` +
    `Ranking: ${res.data.ranking}\n` +
    `Total Solved: ${res.data.totalSolved}\n` +
    `\tEasy: ${res.data.easySolved}\n` +
    `\tMedium: ${res.data.mediumSolved}\n` +
    `\tHard: ${res.data.hardSolved}\n`
  );
};

// Command function

function help(message: Message, param: string) {
  if (param) return;

  const helpEmbed = new EmbedBuilder().setTitle('Cringe Bot').addFields(
    { name: '!help', value: 'Display this page' },
    { name: '!roast <username>', value: 'Get roasted/Roast someone' },
    {
      name: '!leetcode <username>',
      value: 'Assign LeetCode username to your discord',
    },
    { name: '!flex', value: 'Show LeetCode stats' },
    { name: '!weather', value: 'Display current weather' },
    { name: '!pointless', value: 'idk, some pointless stuff' }
  );

  message.channel.send({ embeds: [helpEmbed] });
  return;
}

async function leetcode(message: Message, param: string) {
  if (!param) {
    message.reply('what the fuck bro, where username');
    return;
  }

  try {
    await addLeetcodeUser(message.author.id, param);
    message.react('✅');
  } catch (err) {
    console.log(err.stack);
    message.react('❌');
  }
}

function pointless(message: Message, param: string) {
  message.reply(
    'It is currently ' +
      new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
      }) +
      '☝️'
  );
}

async function weather(message: Message, param: string) {

  if (!param) {
    param = 'brossard'
  }

  try {
    
    const weatherData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=64206d65bc341529c8fea8f9158d50d4&units=metric`);

    console.log(weatherData)

    const currentTemp = weatherData.data.main.temp;

    const nameOfCity = weatherData.data.name;

    message.reply(
      `It is currently ${currentTemp} \u00B0C in ${nameOfCity}`      
    )

  } catch (err) {
    console.log(err)
    message.reply('write the city name correctly')
  }
}

async function roast(message: Message, param: string) {
  const roast = await getRoast();
  if (!param) {
    message.channel.send(roast);
  } else {
    if (!param.match(MessageMentions.UsersPattern)) return;
    message.channel.send(`${param}, ${roast}`);
  }
}

function secret(message: Message, param: string) {
  if (message.author.id === '294616941870710784') {
    message.reply('add more roasts');
    return;
  }
  message.channel.send('tg simon');
}

async function flex(message: Message, param: string) {
  if (param) return;

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

async function analysis(message: Message, param: string) {
  let limit = 10; // default of 10
  if (param && !isNaN(param as any)) limit = parseInt(param);
  message.reply(await getWordCount(limit));
}

async function nutcount(message: Message, param: string){
  if (param){
    const id = param.substring(2,param.length - 1)
    message.reply('deez nuts count: ' + await getDeezNutsCount(id))
  }
  else{
    message.reply('deez nuts count: ' + await getDeezNutsCount(message.author.id))
  }
}

export { useCommand };
