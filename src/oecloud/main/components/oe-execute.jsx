import React, { Component, PropTypes } from "react"
// import { fromJS } from "immutable"
export default class OeExecute extends Component {

  onExecute = () => {
    let {opToolbox, operation, fn } = this.props
    console.log('HookData:', opToolbox.getHookData())
    opToolbox.setExecuteProgress(true)

    setTimeout(function(){
      opToolbox.setExecuteProgress(false)
    }, 5000)
  }

  render() {
    console.log("OeExecute")
    return (
      <button className="btn execute opblock-control__btn" type="button" onClick={ this.onExecute }>
        Execute
      </button>
    )
  }
}
