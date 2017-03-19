import axios from 'axios'
import { decode } from 'he'

async function getWise (fullName) {
  const [ firstName, lastName ] = fullName.split(' ')
  const url = `http://api.icndb.com/jokes/random?firstName=${firstName.trim()}&lastName=${lastName.trim()}`

  let response

  try {
    response = await axios.get(url)
    if (response.data.type !== 'success') throw new Error('Error recalling Chuck Norris wisdom')
  } catch (e) {
    console.error(e)
    return
  }

  return decode(response.data.value.joke)
}

export default getWise
