import OeLayout from "./oelayout"
import "../../style/main.scss"

import ConfigsPlugin from "plugins/configs"
import AccessTokenPlugin from "./plugins/access-token"
import SpecPlugin from "./plugins/spec"
import ViewPlugin from "./plugins/view"

// import Banner from "./components/banner"
// import OeBaseLayout from "./components/base"
// import OeOperations from "./components/oe-operations"
// import OeOperation from "./components/oe-operation"
// import Tag from "./components/tag"
// import TaggedOp from "./components/tagged-op"
// import OeParameters from "./components/oe-parameters"

import Ui from "./components/all"

module.exports = [
  ConfigsPlugin,
  AccessTokenPlugin,
  SpecPlugin,
  ViewPlugin,
  Ui,
  () => {
    return {
      components : {
        OeLayout
      }
    }
  }
]
