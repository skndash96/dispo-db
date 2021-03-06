const db = require("../schemas/player.js");
const Discord = require("discord.js");
const getErrors = require('../functions/getErrors.js');
const getEmoji = require('../functions/getEmoji.js');
const rollToss = require('../functions/rollToss.js');
const chooseToss = require('../functions/chooseToss.js');
const startMatch = require('./duoMatch.js');
const embedColor = require('../functions/getEmbedColor.js');
const checkWill = require('../functions/checkWill.js');

module.exports = async (client, message, user, target) => {
  const { channel, content, author } = message;
  
  //Check Target's Will
  await channel.send(`${target} do you want to play football with ${user.username}? Type \`y\`/\`n\` in 30s, flags exists.`);
  
  let post;
  if (content.toLowerCase().includes('--post')) post = true;
  
  let will = await checkWill(channel, target, post);
  post = will[1];
  will = will[0];
  
  if(will === true) {
    const tossWinner = await rollToss(message, user, target, 'football');
    try {
      let userIsAtk = tossWinner.id === user.id
      var chosen = await chooseToss(
        message,
        userIsAtk ? user : target,
        userIsAtk ? target : user,
        'football'
      );
      var attacker = chosen[0];
      var defender = chosen[1];
      let check = await checkDms();
    } catch (e) {
      await changeStatus(user, false);
      await changeStatus(target, false);
      await message.reply(e)
      return
    }
    startMatch(client, message, attacker, defender, post)
  } else {
    changeStatus(user, false);
    changeStatus(target, false);
    return;
  }
  
  async function checkDms() {
    let embed = new Discord.MessageEmbed()
      .setTitle('Football Match')
      .setDescription('The Refree has blown the whistle, Lets Gooo!')
      .setColor(embedColor);
    await channel.send('Get to your DMs', { embed });
    try {
      await user.send(embed);
    } catch (e) {
      throw `Cant send dms to ${user}`
    }
    try {
      await target.send(embed);
    } catch (e) {
      throw`Cant send dms to ${target}`
    }
    return
  } 
}

async function changeStatus(a, boolean = false) {
  if(typeof boolean !== "boolean") return;
  await db.findOneAndUpdate({_id: a.id}, { $set: {status: boolean}});
}