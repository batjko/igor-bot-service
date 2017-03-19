const lower = a => a.toLowerCase()


export const isRelease = args => args.map(lower)
  .findIndex(a => ['release', 'push', 'publish'].includes(a)) > -1

export const getVersionType = args => args.map(lower)
  .find(v => ['patch', 'minor', 'major', 'skip'].includes(v))

export const isQuestion = args => args.map(lower)
  .findIndex(a => ['what', 'which', 'who', 'when', 'where', '?', 'how', 'why'].includes(a)) > -1

export const getCmdType = (args) => {
  if (isRelease(args)) return 'RELEASE'
  if (isQuestion(args)) return 'INFO'

  return false
}
