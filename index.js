const slackTerminal = require('slack-terminalize')
const path = require('path')

// Slack token must be set as env variable on server
slackTerminal.init(process.env.slackToken, {
  autoReconnect: true
}, {
  CONFIG_DIR: path.join(__dirname, '/config'),
  COMMAND_DIR: path.join(__dirname, '/commands'),
  ERROR_COMMAND: 'error'
})
