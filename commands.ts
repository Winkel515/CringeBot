const {
  Client,
  GatewayIntentBits,
  Emoji,
  EmbedBuilder,
} = require('discord.js');

const commands = {
  '!help': help,
};

function help(message) {
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
}
