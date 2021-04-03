const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Get help!',
  category: 'General',
  syntax: 'e.help',
  run: async (message, args, prefix, client) => {
    
    const commands = await getCommands();
    const general = commands[0];
    const cricket = commands[1];
    const minigames = commands[2];
    
    const send = new Discord.MessageEmbed()
      .setTitle('Help')
      .setDescription('Here\'s an Interactive GUIDE for you!\n\n')
      .addField('Navigate via the pages of the guide by typing the number.', 
      '1) ❓ - **__About and Guide__**\n2) 👀 - **__General Conmands__**\n3) 🏏 - **__Cricket Commands__**\n4) 🏋️ - **__Minigames Commands__**')
      .setColor('BLUE')
      .setFooter('Requested by ' + message.author.tag);
    
    const aboutEmbed = new Discord.MessageEmbed()
      .setTitle('About Cricket')
      .setDescription('Not actually cricket, but **__handcricket__**. A popular kiddo game originated in **South India** and spread to whole India')
      .addField('How to Play?', 'Once when you start a match, get to dms to play. It is played in dms cause the numbers are supposed to be hidden...\n\n' +
      'The bowler bowls a ball(types a number), the batsman is gonna hit the ball(typing a number). If both the numbers are same, it is a Wicket(His chance got over) else the batsman number adds to his score, and after wicket, the next innings starts with a target that batsman has hit in total\n\n' +
      'The batsman and bowler in first innings gets swapped their position. Now the batsman(i.e the bowler in innings 1) had to chase the bowler\'s(i.e. batsman in innings 1) score\n\n' +
      'If the batsman ever hit the same number that was bowler, bolwer wins, else if the batsman crosses the target, batsman wins. **Sounds trash(coz u were lazy to read, weren\'t you?) but Great When you Get Real with your friends! Get Real When!**')
      .setFooter('Type `back` to navigate back.')
      .setColor('BLUE');
       
    const generalEmbed = new Discord.MessageEmbed()
      .setTitle('General Commands')
      .setDescription(general)
      .setColor('BLUE')
      .setFooter('Type `back` to navigate back.');
      
    const cricketEmbed = new Discord.MessageEmbed()
      .setTitle('Cricket Commands')
      .setDescription(cricket)
      .setColor('BLUE')
      .setFooter('Type `back` to navigate back.');
      
    const minigamesEmbed = new Discord.MessageEmbed()
      .setTitle('Minigames Commands')
      .setDescription(minigames)
      .setColor('BLUE')
      .setFooter('Type `back` to navigate back.');
      
    const embed = await message.channel.send(send);
    
    let goBack = false;
    
    let inAbout = false;
    
    loopHelp();
    async function loopHelp() {
      try {
        const collected = await message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1, time: 30000, errors: ['time'] }
        );
        const msg = collected.first();
       
        if(msg.content == '1') {
          if(goBack == false) {
            embed.edit(aboutEmbed);
            inAbout = true;
            goBack = true;
          } 
          setTimeout(() => {
            return loopHelp();
          }, 10000);
        }
        else if(msg.content == '2') {
          if(goBack == false) {
            embed.edit(generalEmbed);
            goBack = true;
          }
          return loopHelp();
        }
        else if(msg.content == '3') {
          if(goBack == false) {
            embed.edit(cricketEmbed);
            goBack = true;
          }
          return loopHelp();
        }
        else if(msg.content == '4') {
          if(goBack == false) {
            embed.edit(minigamesEmbed);
            goBack = true;
          }
          return loopHelp();
        }
        else if(msg.content.trim().toLowerCase() == 'b' || msg.content.trim().toLowerCase() == 'back') {
          if(goBack == true) {
            embed.edit(send);
            goBack = false;
            inAbout = false;
          }
          return loopHelp();
        }
        else {
          return loopHelp();
        }
      } catch(e) {
        if(inAbout == true) {
          inAbout = false;
          return loopHelp();
        }
        embed.delete();
        return;
      }
    }
  }
};

function getCommands() {
  let General = '';
  let Cricket = '';
  let Minigames = '';
  const folders = fs.readdirSync('./commands');
  for(const folder of folders) {
    const files = fs.readdirSync(`./commands/${folder}`);
    for(const file of files) {
      const command = require(`../${folder}/${file}`);
      if(folder.toLowerCase() == 'cricket') {
        Cricket += `**${command.name}** - \`${command.syntax}\`\n ${command.description}\n\n`;
      } else if (folder.toLowerCase() == 'general') {
        General += `**${command.name}** - \`${command.syntax}\`\n ${command.description}\n\n`;
      } else if (folder.toLowerCase() == 'minigames') {
        Minigames += `**${command.name}** - \`${command.syntax}\`\n ${command.description}\n\n`;
      }
    }
  }
  return [
    General, Cricket, Minigames
  ];
}