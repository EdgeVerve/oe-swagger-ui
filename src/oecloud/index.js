import OeLayout from "./oelayout"
import "../style/main.scss"

import ConfigsPlugin from "plugins/configs"
import Banner from "plugins/oecloudbanner"

module.exports = [
  Banner,
  ConfigsPlugin,
  () => {
    return {
      components : { OeLayout }
    }
  }
]
