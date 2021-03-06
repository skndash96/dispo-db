let challenges = {
  'noChallenge': {
      info: 'Non-Challenging Solo Match',
      innings: 1,
      type: 'bat',
      wickets: 1,
      overs: 5,
      currentScore: 0,
      oldLogs: { ballArray: [0], batArray: [0] },
      doubleInnings: true,
      update: false,
  },
  'classic': {
    1: {
      info: 'Score 50 runs in 4 overs with 2 wickets.',
      innings: 2,
      type: 'bat',
      wickets: 2,
      overs: 4,
      currentScore: 0,
      oldLogs: { ballArray: [0, 1], batArray: [0, 50] },
      doubleInnings: false,
    },
    2: {
      info: 'Win before the bot chases this target.',
      innings: 2,
      type: 'bowl',
      wickets: 1,
      overs: 10,
      currentScore: 65,
      oldLogs: { ballArray: [0, 1], batArray: [0, 98] },
      doubleInnings: false,
    },
    3: {
      info: 'Chase this target.',
      innings: 2,
      type: 'bat',
      wickets: 1,
      overs: 5,
      currentScore: 34,
      oldLogs: { ballArray: [0, 1], batArray: [0, 70] },
      doubleInnings: false,
    },
    4: {
      info: 'Take a wicket in 12 balls.',
      innings: 2,
      type: 'bowl',
      wickets: 1,
      overs: 2,
      currentScore: 1,
      oldLogs: { ballArray: [0, 1], batArray: [0, 50] },
      doubleInnings: false,
    },
    5: {
      info: 'Win this match.',
      innings: 1,
      type: 'bat',
      wickets: 1,
      overs: 5,
      currentScore: 0,
      oldLogs: { ballArray: [0], batArray: [0] },
      doubleInnings: true,
    },
  }
}

module.exports = (message, progress, flags) => {
  let mode = progress.split('_')[0]
  let num = progress.split('_')[1]
  if (num > 5) return
  
  let challenge
  if (progress == 'noChallenge') {
    challenge = challenges[progress]
    challenge.wickets = (flags || {}).wickets || 1
    challenge.overs = (flags || {}).overs || 5
  } else {
    challenge = (challenges[mode])[parseInt(num) + 1]
  }
  
  if (!challenge) return undefined
  
  challenge.CPU = {
    id: 'CPU',
    username: 'CPU',
    send: (text) => (text),
  }
  if (flags.post) challenge.post = true
  challenge.name = num ? `${mode}_${num}` : progress
  challenge.player = message.author
  challenge.message = message
  return challenge
}
