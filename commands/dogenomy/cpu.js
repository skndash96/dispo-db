const duoInnings = require('../../cricketFunctions/duoInnings.js')
const db = require('../../schemas/player.js')
const getChallenge = require('../../cricketFunctions/getChallenges.js')

module.exports = {
  name: 'cpu',
  syntax: 'e.cpu',
  run: async ({ message }) => {
    let { content, channel, author } = message

    let data = await db.findOne({ _id: author.id })
    
    let challenge = getChallenge(message, (data.challenge || {}).progress || 'classic_1')
    
    challenge.player.data = data
    challenge.player.pattern = data.pattern
    challenge.player.pattern = Object.entries(challenge.player.pattern).sort((a, b) => b[1] - a[1])
    challenge.player.pattern = challenge.player.pattern.map(x => x[0])

    await channel.send(`DM`)
    await duoInnings(challenge.player, challenge.CPU, message, { max: 6, post: false }, challenge)
  }
}