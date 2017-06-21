import React, { PropTypes } from "react"
// import shallowCompare from "react-addons-shallow-compare"
import { getList } from "core/utils"
// import * as CustomPropTypes from "core/proptypes"
// import { diff } from "deep-diff"
//import "less/opblock"

import Parameters from "./parameters"

export default class Operation extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    operation: PropTypes.object.isRequired,
    showSummary: PropTypes.bool,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  static defaultProps = {
    showSummary: true,
    response: null,
    allowTryItOut: true,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      showInfo: false
    }

    // this.shownFlag = this.isShown()
    // this.hasProducesValue = false
    // this.hasConsumesValue = false

    // this.updateParams = this._updateParams.bind(this)
    // this.getParams = this._getParams.bind(this)

  }

  isShown =() => {
    return this.state.showInfo
  }

  onTryoutClick =() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onCancelClick =() => {
    // let { path, method } = this.props
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
    // console.log('why??');
    // console.log([path, method]);
    // specActions.clearValidateParams([path, method])
  }

  onExecute = () => {
    // let { specActions, authSelectors, path, method } = this.props

    this.setState({ executeInProgress: true })
  }

  toggleShown = () => {
    this.setState({ "showInfo" : !this.state.showInfo })
  }

  render() {
    let {
      path,
      method,
      operation,
      showSummary,
      getComponent,
      specSelectors
    } = this.props
    // console.log('op render:', this.getParams());
    // let gp = this.getParams
    let summary = operation.get("summary")
    let description = operation.get("description")
    let deprecated = operation.get("deprecated")
    let externalDocs = operation.get("externalDocs")
    let responses = operation.get("responses")
    let security = operation.get("security") || specSelectors.security()
    let produces = operation.get("produces")
    let schemes = operation.get("schemes")
    let parameters = getList(operation, ["parameters"])

    const Responses = getComponent("responses")
    // const Parameters = getComponent( "parameters" )
    const Collapse = getComponent( "Collapse" )
    const Markdown = getComponent( "Markdown" )
    const Schemes = getComponent( "schemes" )

    // Merge in Live Response
    // if(response && response.size > 0) {
    //   let notDocumented = !responses.get(String(response.get("status")))
    //   response = response.set("notDocumented", notDocumented)
    // }

    // let { tryItOutEnabled } = this.state
    let shown = this.isShown()
    // let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )
    // console.log(onChangeKey);
    return (
        <div className={deprecated ? "opblock opblock-deprecated" : shown ? `opblock opblock-${method} is-open` : `opblock opblock-${method}`} >
          <div className={`opblock-summary opblock-summary-${method}`} onClick={this.toggleShown} >
            <span className="opblock-summary-method">{method.toUpperCase()}</span>
            <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <span>{path}</span>
            </span>

            { !showSummary ? null :
                <div className="opblock-summary-description">
                  { summary }
                </div>
            }

          </div>

          <Collapse isOpened={shown} animated>
            <div className="opblock-body">
              { deprecated && <h4 className="opblock-title_normal"> Warning: Deprecated</h4>}
              { description &&
                <div className="opblock-description-wrapper">
                  <div className="opblock-description">
                    <Markdown source={ description } />
                  </div>
                </div>
              }
              {
                externalDocs && externalDocs.get("url") ?
                <div className="opblock-external-docs-wrapper">
                  <h4 className="opblock-title_normal">Find more details</h4>
                  <div className="opblock-external-docs">
                    <span className="opblock-external-docs__description">{ externalDocs.get("description") }</span>
                    <a className="opblock-external-docs__link" href={ externalDocs.get("url") }>{ externalDocs.get("url") }</a>
                  </div>
                </div> : null
              }
              <Parameters
                parameters={parameters}
                getComponent={ getComponent }
                specSelectors={ specSelectors }
                pathMethod={ [path, method] }/>
            </div>
          </Collapse>
        </div>
    )
  }

}
