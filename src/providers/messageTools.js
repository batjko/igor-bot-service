const iconMap = {
  good: 'https://www.ifonly.com/images/io/icon_checkmark_green.png',
  danger: 'https://img.clipartfest.com/cc87ef190e3fc50966a405a1a02cada1_thumbs-down-circle-clipart-thumbs-down_1809-1802.png'
}

const defaultOptions = {
  as_user: true,
  unfurl_links: true,
  unfurl_media: true,
  link_names: 1
}

export const createMessageBlock = ({ success = true, firstField, secondField, command, ...other }) => [{
  ...defaultOptions,
  ...other,
  color: success ? 'good' : 'danger',
  'fields': [
    {
      'title': firstField.title,
      'value': firstField.value,
      'short': true
    },
    {
      'title': secondField && secondField.title,
      'value': secondField && secondField.value,
      'short': true
    }
  ],
  // 'image_url': 'http://my-website.com/path/to/image.jpg',
  'thumb_url': success ? iconMap['good'] : iconMap['danger'],
  'footer': command,
  'footer_icon': 'https://cdn2.iconfinder.com/data/icons/flurry-icons-for-deviants/512/command_prompt.png',
  'ts': Math.floor(Date.now() / 1000)
}]
