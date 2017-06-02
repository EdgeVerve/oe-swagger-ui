import OeLayout from "./oelayout"
import "../style/main.scss"

import ConfigsPlugin from "plugins/configs"
import Banner from "plugins/oecloudbanner"
console.log(ConfigsPlugin);
module.exports = [
  Banner,
  ConfigsPlugin,
  () => {
    return {
      components : { OeLayout }
    }
  }
]
