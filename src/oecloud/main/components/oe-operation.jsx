import React, { PropTypes } from "react"
import { getList } from "core/utils"

export default class OeOperation extends React.Component {

	constructor(props, context) {
    super(props, context)
    this.state = {
      shown: false,
      response: null,
      executeInProgress: false
    }
    this.hooks = []
    this.dataCache = {}
  }

  clearHooks = () => { this.hooks = [] }

  addHook = (name, ctrl, isXml) => {
    console.log('AddHook:', { name, ctrl, isXml })
    // ctrl ? this.hooks.push({ name, ctrl, isXml }) : NOOP()
    if (ctrl) {
      this.hooks.push({ name, ctrl, isXml })
    }
  }

  getHookData = () => {
    console.log('getHookData:')
    return this.hooks.map( hook => {
      let { name, ctrl } = hook
      let value = null
      let isXml = hook.isXml
      if(ctrl && ctrl.tagName === "SELECT") {
        value = ctrl.options[ctrl.selectedIndex].value
      }
      else if(ctrl && ctrl.value) {
        value = ctrl.value
      }

      return { name, value, isXml }
    })
  }

  setCacheData = (key, value) => this.dataCache = Object.assign({}, this.dataCache, {[key] : value})

  updateResponse = (response) => this.setCache({ response : response })

  toggleShown = () => {
    this.setState({ shown: !this.state.shown })
  }

  runExecute = () => {
    let self = this
    console.log("ASYNC: start")
    console.log("DATA:", this.getHookData())
    this.setState({
      executeInProgress: true
    })

    setTimeout(function() {
      console.log("ASYNC: end")
      self.setState({
        executeInProgress: false
      })
    }, 2000)
  }

  render() {
    console.log("RENDER: OeOperation")
    let { operation, method, path, toolbox } = this.props
    let { getComponent, fn, specSelectors } = toolbox
    // console.log('fn:', fn)
    let Collapse = getComponent("Collapse")
    let Parameters = getComponent("OeParameters")
    let Execute = getComponent("OeExecute")
    let Responses = getComponent("OeResponses")

    let summary = operation.get("summary")
    let description = operation.get("description")
    let deprecated = operation.get("deprecated")
    let externalDocs = operation.get("externalDocs")
    let responses = operation.get("responses")
    let security = operation.get("security") || specSelectors.security()
    let produces = operation.get("produces")
    let schemes = operation.get("schemes")
    let parameters = getList(operation, ["parameters"])
    let consumes = operation.get("consumes")

    let shown = this.state.shown

    let parameterHooks = {
      clearHooks: this.clearHooks,
      addHook: this.addHook,
      setCacheData: this.setCacheData
    }

    let executeHooks = {
      getHookData: this.getHookData,
      updateResponse: this.updateResponse,
      runExecute: this.runExecute
    }

    return (
        <div className={ deprecated ? "opblock opblock-deprecated" : (shown ? `opblock opblock-${method} is-open` : `opblock opblock-${method}`)}>
          <div className={`opblock-summary opblock-summary-${method}`} onClick={ this.toggleShown }>
            <span className="opblock-summary-method">{method.toUpperCase()}</span>
            <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <span>{path}</span>
            </span>

            <div className="opblock-summary-description">
              { summary }
            </div>
          </div>
          <Collapse isOpened={shown}>
            <div className="opblock-body">
              <Parameters
                parameters={ parameters }
                path={ path }
                method={ method }
                opToolbox= { parameterHooks }
                consumes={ consumes }
                getComponent={ getComponent }
                fn={ fn }
                specSelectors={ specSelectors }
              />
              <div className="execute-wrapper">
                <Execute
                  operation={ operation }
                  path={ path }
                  method={ method }
                  opToolbox={ executeHooks }
                  fn={ fn }
                />
              </div>
            </div>
            {
              this.state.executeInProgress ? <div>Executing...</div> : null
            }
            <Responses response={ this.state.response } operation={ operation } />
          </Collapse>
        </div>
      )
  }
}
