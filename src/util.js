import slack from 'slack-terminalize'
const webClient = slack.getWebClient()
/**
 * Wrapper function for postMessage from slack-client to handle formatting.
 *
 * @param  { object } slack-client Channel boject
 * @param  { string } message to send to Slack channel
 * @param  { boolean } flag to indicate block formatting
 * @return { none }
 *
 */
function postMessage (channel, response, usePanel) {
  response = (usePanel && '```' + response + '```') || response

  // more on this API here: https://api.slack.com/methods/chat.postMessage
  webClient.chat.postMessage(channel, response, {
    as_user: true,
    unfurl_links: true,
    unfurl_media: true,
    link_names: 1,
    attachments: [
      {
        'fallback': response,
        'color': 'rgb(100%, 0%, 5.2%)',
        // 'pretext': 'Optional text that appears above the attachment block',
        'author_name': 'Bobby Tables',
        'author_link': 'http://flickr.com/bobby/',
        'author_icon': 'https://image.flaticon.com/teams/new/1-freepik.jpg',
        'title': 'Slack API Documentation',
        'title_link': 'https://api.slack.com/',
        'text': 'Optional text that appears within the attachment',
        'fields': [
          {
            'title': 'Priority',
            'value': 'High',
            'short': false
          }
        ],
        'image_url': 'http://my-website.com/path/to/image.jpg',
        'thumb_url': 'http://example.com/path/to/thumb.png',
        'footer': 'Slack API',
        'footer_icon': 'https://platform.slack-edge.com/img/default_application_icon.png',
        'ts': 123456789
      }
    ]
  })
}

export default {
  postMessage
}
