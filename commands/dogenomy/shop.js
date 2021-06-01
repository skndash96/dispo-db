const Discord = require('discord.js');
const db = require('../../schemas/player.js');
const itemDb = require('../../schemas/items.js');
const gain = require('../../functions/gainExp.js');
const getEmoji = require('../../index.js');
const embedColor = require('../../functions/getEmbedColor.js');

module.exports = {
  name: "shop",
  aliases: ["market"],
  description: 'Displays the items that are for sell in the shop',
  category: 'Dogenomy',
  syntax: 'e.shop',
  cooldown: 5,
  run: async ({message}) => {
    const { content, author, channel, mentions } = message;
    const coinsEmoji = await getEmoji('coin');

    const data = await db.findOne( {_id: author.id });
    
    const docs = await itemDb.find({}).sort({_id: 1});
    
    let i = 0;
    let text = `You can buy an item by typing "!buy <name> <amount>", you have a total of ${coinsEmoji} ${data.cc}\n\n`;
    
    const embed = new Discord.MessageEmbed()
      .setTitle(`Shop Items`)
      .setDescription(text)
      .setFooter(`Requested by ${author.tag}`)
      .setColor(embedColor);
        
    docs.forEach(async doc => {
      const title = doc.name.charAt(0).toUpperCase() + doc.name.slice(1);
      const itemEmoji = await getEmoji(doc.name);
      text += `** ${itemEmoji} ${title}** - [${doc.price}](https://egal)`;
      text += `\n${doc.description}\n\n`;
      embed.setDescription(text);
      i += 1;
      if(i === docs.length) {
        await message.reply(embed);
        await gain(data, 1, message);
      }
    });
  }
};