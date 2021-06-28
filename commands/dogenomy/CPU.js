let duoInnings = require('../../cricketFunctions/duoInnings.js')

module.exports = {
  name: 'cpu',
  syntax: 'e.cpu',
  run: async ({ message }) => {
    let { content, channel, author } = message

    let wickets = 2
    let overs = 8
    let target = Math.floor(Math.random() * 100)
    let innings = 2
    let max = 6
    let post = false
    let CPU = {
      username: 'CPU',
      send: function(i) { console.log(i) },
      id: 'CPU',
    }
    let type = 'bat'

    let challenge = {
      CPU,
      wickets,
      overs,
      target,
      innings,
      max,
      post,
      type,
      player: author
    }

    await channel.send(`setted up match for\n Chasing ${target} in ${overs * 6} balls with ${wickets} wickets`)
    await duoInnings(author, CPU, message, false, 6, wickets, overs, challenge)
  }
}