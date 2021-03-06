const db = require('../schemas/player.js');
const itemDb = require('../schemas/items.js');
const getErrors = require('./getErrors.js');

module.exports = async function (itemName, amount, data, msg) {
  const oldBag = data.bag || {};
  const oldAmount = oldBag[itemName] || 0;
  const newAmount = oldAmount - parseInt(amount);
  
  if(amount > 0) {
    if (!oldAmount || oldAmount < amount) {
      throw getErrors({error: "lessAssets", itemName})
      return
    } 
  }
  if (newAmount === 0) {
    delete oldBag[itemName];
  } else {
    oldBag[itemName] = newAmount;
  }

  await db.findOneAndUpdate({
    _id: data._id
  }, {
    $set: {
      bag: oldBag
    }
  }, { new: true, upsert: true });

};
