import { pascalCaseFilename } from "core/utils"

let request = require.context(".", true, /\.jsx?$/)

let components = request.keys().reduce((bldr, key) => {
  if (key === './all.js') {
      return bldr
  }
  let mod = request(key)
  return Object.assign(bldr, {
      [pascalCaseFilename(key)] : mod.default ? mod.default : mod
  })
}, {})

export default function() {
    return {
      components
    }
}
