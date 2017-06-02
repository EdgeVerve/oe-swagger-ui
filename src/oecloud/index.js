import OeLayout from "./oelayout"
import "../style/main.scss"

import ConfigsPlugin from "plugins/configs"

module.exports = [
  ConfigsPlugin,
  () => {
    return {
      components : { OeLayout }
    }
  }
]
