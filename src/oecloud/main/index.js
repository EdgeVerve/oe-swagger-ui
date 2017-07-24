import OeLayout from "./oelayout"
import "../../style/main.scss"

import ConfigsPlugin from "plugins/configs"
import Banner from "./components/banner"
import AccessTokenPlugin from "./plugins/access-token"

module.exports = [
  ConfigsPlugin,
  AccessTokenPlugin,
  () => {
    return {
      components : { OeLayout, Banner }
    }
  }
]
