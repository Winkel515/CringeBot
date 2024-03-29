import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import { addWordToDB, addDeezNutsCount, handleCount } from './database';
import { useCommand } from './commands';
import cron from 'node-cron';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  const gymChannel = <TextChannel>(
    client.channels.cache.get('1047194613754110042')
  );

  cron.schedule('0 0 23 1 * *', async () => {
    const message = await gymChannel.send(
      '<@248620802528903168>, you have completed another month at the gym!'
    );
    message.react('<:SamFlemessageLeft:1049745354180022272>');
    message.react('<:leena:1045072832784248944>');
    message.react('<:SamFlexRight:1050105851676995624>');
  });

  cron.schedule('0 0 23 6 1 *', async () => {
    gymChannel.send('This message should have been sent on Jan 6th at 6PM EST');
  });

  cron.schedule('0 30 11 * * 1', async () => {
    const message = await gymChannel.send(
      '<@195278304700399616>, GYM PIC OR NO BIG MAC.'
    );
    message.react('🍔');
    message.react('🍟');
    message.react('🥤');
  });

  console.log('CringeBot is ready!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  addWordToDB(message.content);

  useCommand(message);

  if (message.channel.id === '1045424290859856003') {
    countingGame(message);
  }

  if (message.content.toLowerCase().includes('dn')) {
    message.react('🍆');
    message.react('💦');
    await addDeezNutsCount(message.author.id);
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

  if (
    message.content.toLowerCase().includes('chilling') &&
    !message.content.toLowerCase().includes('1044664066712551494')
  ) {
    message.reply('<:BingChilling:1044664066712551494>');
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

  // Jeff
  if (message.author.id === '82195381156315136') {
    message.react('<:furball:1077599037286527106>');
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
