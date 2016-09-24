module.exports = function (param) {
  function getRandomNum (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  if (param.args && param.args.find(x => x.toLowerCase() === 'snapple-me')) {
    const jsonfile = require('jsonfile')
    const util = require('../util')

    console.log(`${(new Date()).toLocaleString()} - Command: ${param.command}\nArgs: ${JSON.stringify(param.args)}`)
    jsonfile.readFile('./config/snapple-facts.json', function (err, data) {
      if (err) return console.error(err)

      let response = null

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
}
