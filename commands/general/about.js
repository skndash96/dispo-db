const db = require('../../schemas/player.js');
const Discord = require('discord.js');
const embedColor = require('../../functions/getEmbedColor.js');

module.exports = {
  name: 'about',
  aliases: ['info'],
  description: 'Shows info about the bot',
  category: 'General',
  syntax: 'e.about',
  run: async ({message, client}) => {
    let { channel } = message;
    let RAM = Math.round( ((process.memoryUsage().heapUsed) /1024 /1024 * 100) / 100) + ' MB';
    let GUILDS = client.guilds.cache.size;
    let USERS = (await db.find()).length;
    let CACHED_USERS = client.users.cache.size;
    let ACTIVE_USERS = (await db.find({ status: true })).length;
    let TIME = parseInt((process.uptime())/60) + ' MINS';
    
    const embed = new Discord.MessageEmbed()
      .setTitle('About Dispo Cheems')
      .setDescription('Thanks to Luck, Chill saur, Aadithya, General Nix, Diego, Killua, Ace, Basara, Prateek and all other peeps who helped the bot grow and test it out.')
      .addField('Links', `[Add the bot](${process.env.INVITE_URL})\n[Community Server](${process.env.COMMUNITY_URL})`)
      .addField('Guilds', `${GUILDS} Guilds`)
      .addField(
        'Users',
        `Unique Users: ${USERS} users\nCached Users: ${CACHED_USERS} users\nPlaying Now: ${ACTIVE_USERS} users`
      )
      .addField('Process', `Ram Usage: ${RAM}\nUptime: ${TIME}`)
      .addField('🔫 Dispo Squad 🔫', `Dash\`#0966\`\nKing Kane\`#0018\`\nGRENINJA\`#0017\`\nUltraMoonEagle\`#3876\`\nsantdas36\`#0440\`\nPanda_Rose\`#1331\``)
      .setFooter('Made with 💖 with discord.js', "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt6B6HUVgdNO6fZQYdFl5GvhMPc1B5_LXjjPDpgTZML7DWZvneIJz7tUc&s=10")
      .setColor(embedColor);
    
    channel.send(embed);
  }
}