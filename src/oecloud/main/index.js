import OeLayout from "./oelayout"
import "../../style/main.scss"

import ConfigsPlugin from "plugins/configs"
import AccessTokenPlugin from "./plugins/access-token"
import SpecPlugin from "./plugins/spec"

import Banner from "./components/banner"
import OeBaseLayout from "./components/base"
import OeOperations from "./components/oe-operations"
import OeOperation from "./components/oe-operation"

module.exports = [
  ConfigsPlugin,
  AccessTokenPlugin,
  SpecPlugin,
  () => {
    return {
      components : { OeLayout, Banner, OeBaseLayout, OeOperations, OeOperation }
    }
  }
]
