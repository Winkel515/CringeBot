import { Client, GatewayIntentBits, EmbedBuilder, Message } from 'discord.js';
import dotenv from 'dotenv';
import {
  addWordToDB,
  addDeezNutsCount,
  getDeezNutsCount,
  handleCount,
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

client.once('ready', () => console.log('CringeBot is ready!'));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  addWordToDB(message.content);

  useCommand(message);

  countingGame(message);

  if (message.content.toLowerCase().includes('dn')) {
    message.react('🍆');
    message.react('💦');
    await addDeezNutsCount(message.author.id);
    message.reply(
      'deez nuts haha gotem\ndeez nuts count: ' +
        (await getDeezNutsCount(message.author.id))
    );
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

  if (message.content.toLowerCase().includes('chilling')) {
    message.reply('<:BingChilling:1044664066712551494>')
  }
  // Winkel
  if (message.author.id === '195278304700399616') {
    message.react('<:sadge:1044403955221925889>');
  }

  // Sam
  if (message.author.id === '294616941870710784') {
    message.react('<:copium:1044402934907146311>');
  }

  // Pearl
  if (message.author.id === '477303173581635584') {
    message.react('<:coco:1044614713495011410>');
  }

  // Simon
  if (message.author.id === '576880753200070666') {
    message.react('<:sam:1044654789805486110>');
  }

  // Ally
  if (message.author.id === '706649359600713750') {
    message.react('🐊');
  }

  // Leena
  if (message.author.id === '248620802528903168') {
    message.react('<:bronze:1044653265452797964>');
  }

  // Patrick
  if (message.author.id === '139469636994465792') {
    message.react('<:patrick:1044721750451171448>');
  }
});

const countingGame = async (message: Message) => {
  const num = Number(message.content);
  if (Number.isInteger(num) && num > 0) {
    const isNextNum = await handleCount(num);
    message.react(isNextNum ? '✅' : '❌');
    if (!isNextNum)
      message.channel.send(
        `${message.author} can't count... Restarting count 😠\n` +
          "I'd recommend you read this: <https://www.wikihow.com/Count-to-One-Hundred>"
      );
  }
};

client.login(process.env.TOKEN);
