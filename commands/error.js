module.exports = function (param) {
	if (param.args.find(x => x.toLowerCase() === 'snapple-me').length > 0) {
		const jsonfile = require('jsonfile')
		const util 	= require('../util')
		function getRandomNum(min, max) {
		  min = Math.ceil(min);
		  max = Math.floor(max);
		  return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		// console.log(JSON.stringify(param.args, null, 2))
		jsonfile.readFile('./config/snapple-facts.json', function(err, data) {
			if (err) return console.error(err)
			const randomNum = getRandomNum(2, 1031) // min and max in data set

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
