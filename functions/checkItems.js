const db = require("../schemas/items.js");
const Discord = require("discord.js");
const getErrors = require('./getErrors.js');

module.exports = async function (message, filePath) {
  
  const args = message.content.toLowerCase().trim().split(' ').slice(1);
  
  if(args.length === 0 && filePath) {
    message.reply(getErrors({error: 'syntax', filePath}));
    return 'err';
  }
  
  //Check args count
  if(filePath && args.length <= 1 && parseInt(args[0])) {
    message.reply(getErrors({error: 'syntax', filePath}));
    return 'err';
  }
  
  //Amount (last word)
  let itemAmountArray = args[args.length - 1]; //returns last word in string
  let itemAmount = parseInt(itemAmountArray); //integer
  
  //Name
  let itemNameArray = args; //Message in []
  if(itemAmount && parseInt(itemAmount)) {
    itemNameArray.pop(); //Kill the last element
  }
  
  let itemName = itemNameArray.join('') || itemAmount;
  
  if(!itemAmount || isNaN(itemAmount)) { //Validates Item
    itemAmount = 1;
  }
  
  
  /*redbull, nuts, dot, magikball, coinboost, tossboost, lootbox */
  if(itemName === "redbull" || itemName === "red") {
    itemName = "redbull";
  }
  if(itemName === "nuts" || itemName === "nut") {
    itemName = "nuts";
  }
  if(itemName === "dots" || itemName === "dot") {
    itemName = "dots";
  }
  if(itemName === "magikball" || itemName === "magik") {
    itemName = "magikball";
  }
  if(itemName === "coin" || itemName === "coinboost" || itemName === 'cb') {
    itemName = "coinboost";
  }
  if(itemName === "toss" || itemName === "tossboost" || itemName === 'tb') {
    itemName = "tossboost";
  }
  if(itemName === "lootbox" || itemName === "lb") {
    itemName = "lootbox";
  }
  
  const itemData = await db.findOne({name: itemName}).catch((e) => console.log(e));
  
  if(!itemData) {
    if(parseInt(args[0])) {
      let error = 'syntax';
      message.reply(getErrors({error, filePath}));
      return 'err';
    } else {
      let error = 'item';
      message.reply(getErrors({error, itemName}));
      return 'err';
    }
  }
  
  return [itemName, itemAmount];
};