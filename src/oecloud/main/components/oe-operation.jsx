import React, { PropTypes } from "react"
import { getList, fromJSOrdered } from "core/utils"
import parseUrl from "url-parse"
import serializeError from "serialize-error"

export default class OeOperation extends React.Component {

	constructor(props, context) {
    super(props, context)

    let operation = props.operation
    let consumesValue = operation.get("consumes_value") || operation.get("consumes").get(0)
    let producesValue = operation.get("consumes_value") || operation.get("consumes").get(0)
    this.state = {
      shown: false,
      executeInProgress: false,
      response: null,
      request: null,
      consumesValue: consumesValue,
      producesValue: producesValue
    }
    this.hooks = []
    this.dataCache = {}
    this.setCacheData("consumes_value", consumesValue)
    this.setCacheData("produces_value", producesValue)
    this.setCacheData("paramCache", {})
  }

  updateParam = (name, value) => {
    let currentCache = this.dataCache["paramCache"]
    currentCache[name] = value
  }

  clearHooks = () => {
// console.log    console.log('Clear Hooks')
    // this.hooks = []
  }

  addHook = (name, ctrl, isXml) => {
// console.log    console.log('AddHook:', { name, ctrl, isXml })
    // ctrl ? this.hooks.push({ name, ctrl, isXml }) : NOOP()
    if (ctrl) {
      this.hooks.push({ name, ctrl, isXml })
    }
  }

  getHookData = () => {
// console.log    console.log('getHookData:')
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
// console.log    console.log("ASYNC: start")
// console.log    console.log("DATA:", this.getHookData())
    let { toolbox, path, method, operation } = this.props
    let { specSelectors, fn, authSelectors } = toolbox

    let spec = specSelectors.spec().toJS()
    let scheme = specSelectors.operationScheme(path, method)
    let requestContentType = this.dataCache["consumes_value"]
    let responseContentType = this.dataCache["produces_value"]

    let parameters;

    let opParameters = operation.get("parameters").toJS().reduce((hash, p) => {
      // let hookEquivalent = hookData[p.name]
      let value = /xml/i.test(requestContentType) ? p.value_xml : p.value
      return Object.assign({}, hash, { [p.name] : value })
    }, {})

    //final parameters
    parameters = Object.assign({}, opParameters, this.dataCache["paramCache"])

    let contextUrl = parseUrl(specSelectors.url()).toString()
    let operationId = operation.get("operationId") || fn.odId(operation.toJS(), path, method)
    let securities = {
      authorized: authSelectors.authorized() && authSelectors.authorized().toJS(),
      definitions: specSelectors.securityDefinitions() && specSelectors.securityDefinitions().toJS(),
      specSecurity:  specSelectors.security() && specSelectors.security().toJS()
    }
    let req = {
      spec,
      scheme,
      requestContentType,
      responseContentType,
      parameters,
      contextUrl,
      operationId,
      securities
    }

    let parsedRequest = fn.buildRequest(req)
    //TODO: log here if you like...
    self.setState({
      executeInProgress: true,
      request: fromJSOrdered(parsedRequest)
    })

    fn.execute(req)
      .then(res => {
// console.log        console.log("ASYNC: end")
        self.setState({
          response: fromJSOrdered(res),
          executeInProgress: false
        })
      })
      .catch(err => {
        self.setState({
          response: fromJSOrdered(Object.assign(
            { error: true, headers: {} }, serializeError(err))),
          executeInProgress: false
        })
      })


  }

  render() {
// console.log    console.log("RENDER: OeOperation")
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

    let response = this.state.response
    let request = this.state.request

    let shown = this.state.shown

    let parameterHooks = {
      clearHooks: this.clearHooks,
      addHook: this.addHook,
      setCacheData: this.setCacheData,
      updateParam: this.updateParam
    }

    let executeHooks = {
      getHookData: this.getHookData,
      updateResponse: this.updateResponse,
      runExecute: this.runExecute,
      setCacheData: this.setCacheData
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
                consumesValue={ this.state.consumesValue }
                getComponent={ getComponent }
                fn={ fn }
                specSelectors={ specSelectors }
                paramsCache={ this.dataCache["paramCache"] }
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
              {
                this.state.executeInProgress ? <div className="loading-container"><div className="loading"></div></div> : null
              }
              {
                !responses ? null : <Responses
                                      responses={ responses }
                                      request={ request }
                                      operation={ operation }
                                      response={ response }
                                      pathMethod={ [path, method] }
                                      produces={ produces }
                                      producesValue={ this.state.producesValue }
                                      specSelectors={ specSelectors }
                                      getComponent={getComponent}
                                      fn={fn}
                                      setCacheData={ this.setCacheData }
                                    />
              }
            </div>


          </Collapse>
        </div>
      )
  }
}
