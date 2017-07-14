// this script bumps the version in package.json

// Supply with the following arguments:
//
//  1. path to file called "changes.txt"
//
//     this file contains the changes that go into the release
//
//  2. release flag - (by default it is assumed to be "patch")
//
//     Allowed values:
//       - "patch"
//       - "minor"
//       - "major"
//
//     Follow semvar scheme

const fs = require("fs")
const path = require("path")
// const exec = require("child_process").exec
const util = require("util")

const padZero = function(n, padLength) {
  var i = 0
  var padStr = ""
  while (i++ < padLength) padStr += "0"
  padStr += n
  return padStr.substring(padStr.length - padLength)
}

const formatDate = function(now) {

  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var day = now.getDate()

  return [year, padZero(month, 2), padZero(day, 2)].join("")
}

const stringify = (obj) => JSON.stringify(obj, null, 2)

var thisDir = __dirname

function runRelease(changeDescFile, releaseFlag) {
  releaseFlag = releaseFlag || "patch"
  var changeLogFilePath = path.resolve(thisDir, "..", "CHANGELOG.md")
  var changeLogContents

  // getting previous changelog contents
  if (!fs.existsSync(changeLogFilePath)) {
    changeLogContents = ""
  }
  else {
    changeLogContents = fs.readFileSync(changeLogFilePath, { encoding: "utf8"})
  }

  // getting the description of new changes
  changeDescFile = path.resolve(changeDescFile)

  if (!fs.existsSync(changeDescFile)) {
    throw "Cannot find file: " + changeDescFile
  }

  var changeDescContents = fs.readFileSync(changeDescFile, { encoding: "utf8"})

  // package.json
  var pkgJsonPath = require.resolve("../package.json")
  var pkg = JSON.parse(fs.readFileSync(pkgJsonPath, {encoding: "utf8"}))
  let [major, minor, patch] = pkg.version.split(".").map(x => parseInt(x))
  if (releaseFlag === "patch") {
    patch++
  }
  else if (releaseFlag === "minor") {
    patch = 0
    minor++
  }
  else if (releaseFlag === "major") {
    patch = minor = 0
    major++
  }
  else {
    throw "unknown release flag"
  }

  var dateStr = formatDate(new Date())

  var publishContent = changeDescContents.split("\r\n")
  var content
  var version = major + "." + minor + "." + patch

  if (changeLogContents.length) {
    //get the date on the first line

    var lines = changeLogContents.split("\r\n")
    var oldDate = lines[0].substr(3, 8)

    if (oldDate === dateStr) {
      //! the same date...

      // copy what you"ve got for that day
      var nxtIdx = lines.findIndex(function(l, idx){
        return idx !== 0 && l.startsWith("##")
      })

      if (nxtIdx === -1) {
        publishContent = publishContent.concat(lines.slice(1))
      }
      else {
        publishContent = publishContent.concat(lines.splice(1, nxtIdx))
        lines.shift()
        publishContent = publishContent.concat(lines)
      }
    }

    var line = util.format("## %s, v%s", dateStr, version)
    publishContent.unshift(line)
    publishContent.push("")
    publishContent = publishContent.concat(lines)
    content = publishContent.join("\r\n")

  }
  else {
    content = util.format("## %s, v%s", dateStr, version) + "\r\n"
    content += changeDescContents
  }

  fs.writeFileSync(changeLogFilePath, content)

  fs.unlinkSync(changeDescFile)

  pkg.version = version

  fs.writeFileSync("package.json", stringify(pkg))
}

function main() {
  var args = process.argv.slice(2)
  var flag = args[1]
  var file = args[0]
  // console.log(args)
  runRelease(file, flag)
}

main()
