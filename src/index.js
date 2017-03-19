import slack from 'slack-terminalize'
import path from 'path'

require('dotenv').config()

slack.init(process.env.SLACK_API, {
  autoReconnect: true
}, {
  CONFIG_DIR: path.join(__dirname, '../config'),
  COMMAND_DIR: path.join(__dirname, '/commands'),
  ERROR_COMMAND: 'error'
})
