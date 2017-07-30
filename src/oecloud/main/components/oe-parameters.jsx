import React, { Component, PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

export default class OeParameters extends Component {

  constructor(...args) {
    super(...args)
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("parameters should update")
    return true
  }

  getParametersUi(parameters, path, method, opToolbox, consumes, getComponent, fn) {
    // let { path, method, opToolbox: {clearHooks}, consumes } = this.props
    let ParameterRow = getComponent("OeParameterRow")
    let { clearHooks } = opToolbox

    clearHooks()
    return (
        <div className="table-container">
          <table className="parameters">
            <thead>
              <tr>
                <th className="col col_header parameters-col_name">Name</th>
                <th className="col col_header parameters-col_description">Description</th>
              </tr>
            </thead>
            <tbody>
              {
                eachMap(parameters, (parameter) => {
                  let name = `${path}-${method}-${parameter.get("name")}`
                  return parameter.get("name") === "access_token" ? null : (<ParameterRow
                                                                                param={ parameter }
                                                                                key={ name }
                                                                                path={ path }
                                                                                method={ method }
                                                                                opToolbox={ opToolbox }
                                                                                getComponent={ getComponent }
                                                                                consumes={ consumes }
                                                                                fn={ fn }
                                                                              />)

                })
              }
            </tbody>
          </table>
        </div>
      )
  }

  render() {
    console.log("RENDER: OeParameters")
    let { parameters, path, method, opToolbox, consumes, fn, getComponent } = this.props

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <h4 className="opblock-title">Parameters</h4>
        </div>
        {
          !parameters.count() ?
              (<div className="opblock-description-wrapper"><p>No parameters</p></div>)
            :
              this.getParametersUi(parameters, path, method, opToolbox, consumes, getComponent, fn)
        }
      </div>
    )
  }
}
