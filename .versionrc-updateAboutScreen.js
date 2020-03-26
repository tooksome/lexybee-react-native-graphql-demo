const GET_VER_RE = new RegExp(/(Lexy-Bee Version: )(\d\.\d\.\d)/, 'm')

module.exports.readVersion = function (contents) {
  const match = GET_VER_RE.exec(contents)
  console.log(match)
  if (! match) { return '' }
  return match[2]
}

module.exports.writeVersion = function (contents, version) {
  const result = contents.replace(GET_VER_RE, `$1${version}`)
  console.log(result)
  return result
}
