const uuid = require('uuid/v1')
const os = require('os')
const promisify = require('es6-promisify')
const shell = require('shelljs')


const gitlab = require('gitlab')({
  url: 'https://gitlab.com',
  token: 'af6MZxXjsr1mpq_Kg53k'
})

const git = require('simple-git')()

async function getProjects () {
  let projects = []

  // The promisified .all function always throws, but with the correct result!
  try {
    projects = await promisify(gitlab.projects.all)()
  } catch (e) {
    if (e && Array.isArray(e)) projects = e
  }

  return projects
}

async function findProject (args) {
  const projects = await getProjects()
  const projectToRelease = projects
    .find(p => args.includes(p.name.toLowerCase()))

  return {
    projectName: projectToRelease && projectToRelease.name,
    projectPath: projectToRelease && projectToRelease.web_url
  }
}

async function runRelease (args) {
  const { projectName, projectPath } = await findProject(args)

  if (!projectName) {
    return {
      success: false,
      text: 'Couldn\'t find a valid Gitlab project in your request.\nPlease check your spelling'
    }
  }

  if (!projectPath) {
    return { success: false, text: `Can't find project '${projectName}' on Gitlab` }
  }

  // pull down latest master
  const cloneFolder = `./temp/${projectName}_${uuid()}`
  try {
    await git.clone(projectPath, cloneFolder, ['--depth', '1'])
  } catch (e) {
    console.error(e)
    return { success: false, text: `Found project '${projectName}', but couldn't clone it` }
  }

  // find release script
  shell.cd(cloneFolder)
  if (!shell.test('-f', `release.cmd`)) {
    shell.cd(`../..`)
    shell.rm('-rf', `temp/${projectName}_*`)
    return { success: false, text: `Couldn't find the release script (${projectName}/release.sh)` }
  }

  // run script
  const result = shell.exec(`release.cmd`)
  shell.cd(`../..`)
  shell.rm('-rf', `temp/${projectName}_*`)
  if (result.code !== 0) {
    return { success: false, text: `Release script failed with status code ${result.code}` }
  }

  // parse output

  const flatten = arr =>
    arr.reduce((acc, val) =>
      acc.concat(Array.isArray(val) ? flatten(val) : val), [])

  const releaseOutput = result.stdout.split(os.EOL)
  const version = flatten(releaseOutput // flatten array
    .filter(line => /v\d+(?:\.\d+)*\b/i.test(line)) // only lines with versions
    .map(line => line.match(/v\d+(?:\.\d+)*\b/i))) // extract just the version strings
    .sort((a, b) => b > a ? 1 : -1) // sort descending

  // return result
  return version.length > 0
    ? { success: true, projectName, projectPath, text: version[0] }
    : { success: false, text: 'Unable to find the version in the release script\'s output' }
}

export default runRelease
// runRelease('test2')
//   .then(output => console.log(JSON.stringify(output, null, 2)))
