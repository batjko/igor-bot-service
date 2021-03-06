import capitalize from 'better-capitalize'
import slack from 'slack-terminalize'
const chat = slack.getWebClient().chat
const RTMClient = slack.getRTMClient()

import runRelease from '../providers/gitlab'
import getWise from '../providers/norris'
import { createMessageBlock } from '../providers/messageTools'

// import promisify from 'es6-promisify'

import { getCmdType, getVersionType } from '../providers/parsers'

// must export as es5, as slack-terminalize expects it
module.exports = async function chuck (param) {
  let user = RTMClient.dataStore.getUserById(param.user)
  user.id = param.user

  // param:
  // 1. command - the primary command name
  // 2. args - an array of strings, which is user's message posted in the channel, separated by space
  // 3. user - Slack client user id
  // 4. channel - Slack client channel id
  // 5. commandConfig - the json object for this command from config/commands.json

  const cmd = getCmdType(param.args) || 'UNKNOWN'

  switch (cmd) {
    case 'RELEASE': {
      let result
      let success
      const versionType = getVersionType(param.args)

      if (versionType) {
        try {
          result = await runRelease(param.args, versionType)
          success = result.success
        } catch (e) {
          success = false
        }
      } else {
        success = false
        result = { text: 'Must provide a *semver* version type (`major` | `minor` | `patch`),\nor `skip` to use current version!' }
      }

      const { text, projectName, projectPath } = result
      const appName = capitalize(projectName)

      if (!success) {
        chat.postMessage(param.channel, null, {
          attachments: createMessageBlock({
            user,
            success,
            fallback: `${appName} Release failed: ${text}!`,
            title: `${appName} Release failed!`,
            text: `${text}!`,
            mrkdwn_in: ['text'],
            firstField: { title: 'Requested By', value: `${user.real_name} (<@${user.id}|${user.name}>)` },
            command: param.args.join(' ')
          })
        })
      } else {
        const version = text
        const wisdom = await getWise(user.real_name)

        chat.postMessage(param.channel, null, {
          attachments: createMessageBlock({
            user,
            success,
            fallback: `${appName} - ${version} released`,
            title: `${appName} - ${version} released`,
            title_link: projectPath,
            text: wisdom,
            firstField: { title: 'Released By', value: `${user.real_name} (<@${user.id}|${user.name}>)` },
            secondField: { title: 'Update Type', value: capitalize(versionType) },
            command: param.args.join(' ')
          })
        })
      }
      break
    }
    case 'INFO': {
      const text = 'Requests for information must go unheard for now.' // info(param.args)

      chat.postMessage(param.channel, null, {
        attachments: createMessageBlock({
          user,
          success: !!text,
          fallback: text || 'Error getting that information',
          appName: 'The Question Answerer...',
          appLink: 'http://google.com',
          title: `${capitalize(param.args.join(' '))}`,
          text: `${text}`,
          mrkdwn_in: ['text', 'title']
          // firstField: { title: `${text ? 'Released By' : 'Requested By'}`, value: `${user.real_name} (<@${user.id}|${user.name}>)` },
          // secondField: { title: 'Info', value: 'foo bar' }
        })
      })
      break
    }
    case 'UNKNOWN':
    default: {
      const success = false

      chat.postMessage(param.channel, null, {
        attachments: createMessageBlock({
          user,
          success,
          title: 'Command does not compute!',
          text: `Chuck Norris _chooses_ not to understand you.`,
          // appName: 'Deviceman',
          // appLink: 'http://gitlab.com/repos/deviceman',
          // firstField: { title: `${success ? 'Released By' : 'Requested By'}`, value: `${user.real_name} (<@${user.id}|${user.name}>)` },
          // secondField: { title: 'Info', value: 'foo bar' },
          mrkdwn_in: ['text'],
          command: param.args.join(' ')
        })
      })
    }
  }
}

  // 'pretext': 'Optional text that appears above the attachment block',
  // 'author_name': `Released by: ${user.real_name} (<@${id}|${user.name}>)`,
  // 'author_link': 'http://flickr.com/bobby/',
  // 'author_icon': 'https://cdn2.iconfinder.com/data/icons/flurry-icons-for-deviants/512/command_prompt.png',
