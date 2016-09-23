const jsonfile = require('jsonfile')
const util = require('../util')

// param comes with the Slack message
module.exports = function (param) {
  // module.exports = function (param) {
  // param object contains the following keys:
  // 1. command - the primary command name
  // 2. args - an array of strings, which is user's message posted in the channel, separated by space
  // 3. user - Slack client user id
  // 4. channel - Slack client channel id
  // 5. commandConfig - the json object for this command from config/commands.json
  function getRandomNum (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  console.log(`${(new Date()).toLocaleString()} - Command: ${param.command}\nArgs: ${JSON.stringify(param.args)}`)
  jsonfile.readFile('./config/snapple-facts.json', function (err, data) {
    if (err) return console.error(err)

    let response

    // try up to 5 times, in case of errors
    let limit = 5
    while (limit > 0) {
      try {
        response = `Did you know:\n${data['' + getRandomNum(2, 1031)].d}`
        break
      } catch (e) {
        limit--
        if (limit === 0) {
          console.error(`Unable to load fact for some reason:\n${e}`)
          response = 'Brain fart. Try again.'
        }
      }
    }

    // send back message
    util.postMessage(param.channel, response)
  })
}
