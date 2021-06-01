const Discord = require('discord.js');
const db = require('../../schemas/player.js');
const embedColor = require('../../functions/getEmbedColor.js');

module.exports = {
  name: 'vote',
  aliases: ['v', 'daily', 'claim'],
  description: 'Vote the bot! Support when',
  category: 'general',
  syntax: 'e.vote',
  run: async ({message, topggapi}) => {
    const { content, author, channel, mentions } = message;
    
    const voted = await topggapi.hasVoted(author.id);
    const data = await db.findOne({_id: author.id});
    
    checkLastVoted(data, message);
    
    if(voted === true) {
      const cooldown = await getCooldown(author);
      const embed = new Discord.MessageEmbed()
        .setTitle('Vote Command')
        .setDescription('Thanks for Supporting me! You have already voted for me.\n' + cooldown +
        '\n [Community Server](https://bit.ly/dispoGuild)' +
        '\n [Invite Bot](https://bit.ly/dispoBot)')
        .addField(`Vote Streak: ${data.voteStreak || 0}`, 'You will get lootboxes after 10 votes and decors for each 25s.')
        .setColor(embedColor)
        .setThumbnail(author.displayAvatarURL());
      message.reply(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setTitle('Vote Command')
        .setDescription('You havent voted yet, Support us [here](https://top.gg/bot/804346878027235398/vote)' + 
        '\n [Community Server](https://bit.ly/dispoGuild)' +
        '\n [Invite Bot](https://bit.ly/dispoBot)')
        .addField(`Vote Streak: ${data.voteStreak || 0}`, 'You will get lootboxes after 10 votes and decors for each 25s.')
        .setColor(embedColor)
        .setThumbnail(author.displayAvatarURL());
      message.reply(embed);
    }
  }
};

async function getCooldown(user) {
  try {
    const data = await db.findOne({ _id: user.id });
    const time = data.voteCooldown;
    if(!time) return '';
    const ms = time.getTime() - Date.now();
    const sec = ms/1000;
    const min = sec/60;
    const hour = (min/60).toString().split('.').shift();
    const remainingMin = (min % 60).toFixed(0) || 0;
    return `You can vote again in ${hour}hour(s) and ${remainingMin}min(s)`;
  } catch (e) {
    console.log(e);
    return '';
  }
}

async function checkLastVoted(data, message) {
  const { content, author, channel, mentions } = message;
  
  if(data.lastVoted && (Date.now - data.lastVoted.getTime()) > (24 * 60 * 60 * 1000)) {
    message.reply('You didnt vote in the last 24 hours and sadly you lost your streak!')
    await db.findOneAndUpdate({ _id: data._id }, {
      $set: {
        voteStreak: 0,
      }
    });
    return;
  }
}