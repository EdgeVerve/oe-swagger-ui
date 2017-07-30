import React, { Component, PropTypes } from "react"
// import { fromJS } from "immutable"
export default class OeExecute extends Component {
  // constructor(props, ctx) {
  //   super(pros, ctx)
  // }
  onExecute = () => {

    this.props.opToolbox.runExecute()

  }

  render() {
// console.log    console.log("RENDER: OeExecute")
    return (
      <button className="btn execute opblock-control__btn" type="button" onClick={ this.onExecute }>
        Execute
      </button>
    )
  }
}
