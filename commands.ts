import { EmbedBuilder, Message, MessageMentions } from 'discord.js';
import axios from 'axios';
import * as deepl from 'deepl-node';
import py from 'tiny-pinyin';

const translator = new deepl.Translator(process.env.DEEPL_KEY);

import {
  addLeetcodeUser,
  getLeetcodeUser,
  getRoast,
  getWordCount,
  getDeezNutsCount,
  addUserToBedtimeCheck,
} from './database';

type Commands = {
  [key: string]: (message: Message, param: string) => Promise<void> | void;
};

const commands: Commands = {
  help,
  roast,
  leetcode,
  flex,
  weather,
  pointless,
  secret,
  analysis,
  nutcount,
  winkelgym,
  leenagym,
  bedtimeCheck,
  translate,
  pinyin,
};

function useCommand(message: Message) {
  let [command, param] = message.content.split(' ');
  if (command.charAt(0) != '!') return;
  command = command.substring(1);
  if (commands[command]) commands[command](message, param);
}

// Utility functions

const getLeetcodeData = async (username) => {
  const res = await axios.get(`http://localhost:8080/${username}`);
  if (res.data.status === 'error') {
    return null;
  }
  return (
    `User: ${username}\n` +
    `Points: ${
      res.data.easySolved + 2 * res.data.mediumSolved + 3 * res.data.hardSolved
    }\n` +
    `Total Solved: ${
      res.data.easySolved + res.data.mediumSolved + res.data.hardSolved
    }\n` +
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
    { name: '!pointless', value: 'idk, some pointless stuff' },
    {
      name: '!analysis',
      value: 'Display top words used in the channel and their count',
    },
    {
      name: '!nutcount',
      value: 'Display how many times you have been nutted on',
    },
    {
      name: '!bedtimeCheck',
      value:
        'Subscribes you to be pinged every night at 10pm for you to rate how productive your day was.',
    }
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
  if (!param) param = 'brossard';

  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=64206d65bc341529c8fea8f9158d50d4&units=metric`
    );
    const currentTemp = weatherData.data.main.temp;
    const nameOfCity = weatherData.data.name;
    message.reply(`It is currently ${currentTemp} \u00B0C in ${nameOfCity}`);
  } catch (err) {
    message.reply('write the city name correctly');
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
    try {
      const data = await getLeetcodeData(username);
      if (!data) {
        message.reply(`"${username}" LeetCode account does not exist`);
      } else {
        message.reply(data);
      }
    } catch (err) {
      message.reply('Feature is dead until we find replacement API 💀');
    }
  }
}

async function analysis(message: Message, param: string) {
  let limit = 10; // default of 10
  if (param && !isNaN(param as any)) limit = parseInt(param);
  message.reply(await getWordCount(limit));
}

async function nutcount(message: Message, param: string) {
  if (param) {
    const id = param.substring(2, param.length - 1);
    message.reply('deez nuts count: ' + (await getDeezNutsCount(id)));
  } else {
    message.reply(
      'deez nuts count: ' + (await getDeezNutsCount(message.author.id))
    );
  }
}

async function winkelgym(message: Message, param: string) {
  const start = Date.UTC(2022, 10, 28); // Nov 28 2022
  const today = Date.now();

  const dif = today - start;

  const numDays = Math.floor(dif / 1000 / 60 / 60 / 24);
  message.channel.send(
    `It has been ${numDays} day${
      numDays === 1 ? '' : 's'
    } since Winkel has started going to the gym.`
  );
}

async function leenagym(message: Message, param: string) {
  const start = Date.UTC(2022, 11, 12); // Dev 12 2022
  const today = Date.now();

  const dif = today - start;

  const numDays = Math.floor(dif / 1000 / 60 / 60 / 24);
  message.channel.send(
    `It has been ${numDays} day${
      numDays === 1 ? '' : 's'
    } since Leena has started going to the gym.`
  );
}

async function bedtimeCheck(message: Message, param: string) {
  try {
    const res = await addUserToBedtimeCheck(message.author.id);
    console.log(res);
    if (!res.success) {
      message.react('❌');
      message.reply(
        'An error has occured. Action not completed successfully. Tell whoever coded this to git gud lmao.'
      );
    } else if (!res.alreadySet) {
      message.react('✅');
      message.reply(
        "You've been successfully subscribed. You'll receive a ping every night at 10pm to ask you how you would rate your day's productivity."
      );
    } else {
      message.react('✅');
      message.reply(
        "You're already subscribed. Wait until 10pm for your daily productivity check."
      );
    }
  } catch (err) {
    console.log(err.stack);
    message.react('❌');
  }
}

async function translate(message: Message, param: string) {
  if (!message.reference) {
    message.reply('You need to reply to the message you want to translate');
    return;
  }
  const toTranslate = (
    await message.channel.messages.fetch(message.reference.messageId)
  ).content;

  if (!toTranslate.match(/[\u3400-\u9FBF]/)) {
    message.reply('The message must be in Chinese');
    return;
  }
  const output = (await translator.translateText(toTranslate, 'zh', 'en-US'))
    .text;
  message.channel.send(output);
}

async function pinyin(message: Message, param: string) {
  if (!message.reference) {
    message.reply('You need to reply to the message you want to translate');
    return;
  }
  const toPinyin = (
    await message.channel.messages.fetch(message.reference.messageId)
  ).content;

  if (!toPinyin.match(/[\u3400-\u9FBF]/)) {
    message.reply('The message must be in Chinese');
    return;
  }

  message.channel.send(py.convertToPinyin(toPinyin, ' ', true));
}

export { useCommand };
