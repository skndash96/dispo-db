const Discord = require("discord.js");
const db = require("../../schemas/player.js");
const itemDB = require("../../schemas/items.js");
const getEmoji = require('../../functions/getEmoji.js');
const checkItems = require("../../functions/checkItems.js");
const gain = require('../../functions/gainExp.js');
const updateBag = require('../../functions/updateBag.js');
const updateCoins = require('../../functions/updateCoins.js');

module.exports = {
  name: 'sell',
  description: 'Sell items and get dogecoins back, not 100% cashback ofcourse.',
  category: 'Dogenomy',
  syntax: 'e.sell <itemName> <amount>',
  cooldown: 10,
  run: async ({message}) => {
    const { author, content, channel, mentions } = message;
    
    try {
      var itemsArray = await checkItems(message, 'dogenomy/sell.js');
    } catch (e) {
      message.reply(e)
      return;
    }
    
    const itemName = itemsArray[0];
    const itemAmount = itemsArray[1];
    const itemEmoji = await getEmoji(itemName);
    const itemPrice = (await itemDB.findOne({ name: itemName })).price;
    
    const data = await db.findOne({ _id: author.id });
    const itemBalance = (data.bag)[itemName] || 0;
    
    if(itemBalance < itemAmount) {
      message.reply(`You dont have that many ${itemEmoji} ${itemName}`);
      return;
    }
    
    await updateBag(itemName, itemAmount, data, message);
    await updateCoins(itemPrice * 0.69 * itemAmount, data);
    
    message.reply(`You sold ${itemAmount} ${itemEmoji} ${itemName} for ${await getEmoji('coin')} ${parseInt((itemPrice * 69/100) * itemAmount)} coins`);
    return;
  }
}