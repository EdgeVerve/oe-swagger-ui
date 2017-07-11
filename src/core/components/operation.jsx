import React, { PropTypes } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { getList } from "core/utils"
import * as CustomPropTypes from "core/proptypes"
// import { diff } from "deep-diff"
//import "less/opblock"

export default class Operation extends React.Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    operation: PropTypes.object.isRequired,
    showSummary: PropTypes.bool,

    isShownKey: CustomPropTypes.arrayOrString.isRequired,
    jumpToKey: CustomPropTypes.arrayOrString.isRequired,

    allowTryItOut: PropTypes.bool,

    response: PropTypes.object,
    request: PropTypes.object,

    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  static defaultProps = {
    showSummary: true,
    response: null,
    allowTryItOut: true,
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      tryItOutEnabled: false,
      params: {}
    }

    this.shownFlag = this.isShown()
    this.hasProducesValue = false
    this.hasConsumesValue = false

    // this.updateParams = this._updateParams.bind(this)
    // this.getParams = this._getParams.bind(this)

  }

  clearHookData = () => {
    console.log('ClearHook:')
    this.hooks = []
  }

  addHook = (name, ctrl, isXml) => {
    console.log('AddHook:', { name, ctrl, isXml })
    ctrl && this.hooks.push({ name, ctrl, isXml })
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

  componentWillReceiveProps(nextProps) {

    // TODO: improve the performance of this code block

    // can we do anything to not dispatch actions
    // here?

    const defaultContentType = "application/json"
    if (this.isShown()) {
      let { specActions, path, method, operation } = nextProps
      let producesValue = operation.get("produces_value")
      let produces = operation.get("produces")
      let consumes = operation.get("consumes")
      let consumesValue = operation.get("consumes_value")
      // console.log([path, method, producesValue, consumesValue]);
      if(nextProps.response !== this.props.response) {
        this.setState({ executeInProgress: false })
      }

      if (producesValue === undefined) {
        producesValue = produces && produces.size ? produces.first() : defaultContentType
        specActions.changeProducesValue([path, method], producesValue)
        this.hasProducesValue = true
      }

      if (consumesValue === undefined) {
        consumesValue = consumes && consumes.size ? consumes.first() : defaultContentType
        specActions.changeConsumesValue([path, method], consumesValue)
        this.hasConsumesValue = true
      }
    }

  }

  getProducesAndConsumesState() {
    return this.hasConsumesValue && this.hasProducesValue
  }

  shouldComponentUpdate(props, state) {
    return shallowCompare(this, props, state)
  }

  toggleShown =() => {
    let { layoutActions, isShownKey } = this.props
    layoutActions.show(isShownKey, !this.isShown())
  }

  isShown =() => {
    let { layoutSelectors, isShownKey, getConfigs } = this.props
    let { docExpansion } = getConfigs()

    return layoutSelectors.isShown(isShownKey, docExpansion === "full" ) // Here is where we set the default
  }

  onTryoutClick =() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onCancelClick =() => {
    let { specActions, path, method } = this.props
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
    // console.log('why??');
    // console.log([path, method]);
    specActions.clearValidateParams([path, method])
  }

  onExecute = () => {
    // let { specActions, authSelectors, path, method } = this.props

    this.setState({ executeInProgress: true })
  }

  render() {
    let {
      isShownKey,
      jumpToKey,
      path,
      method,
      operation,
      showSummary,
      response,
      request,
      allowTryItOut,

      fn,
      getComponent,
      specActions,
      specSelectors,
      authActions,
      authSelectors
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
    const Parameters = getComponent( "parameters" )
    const Execute = getComponent( "execute" )
    const Clear = getComponent( "clear" )
    const AuthorizeOperationBtn = getComponent( "authorizeOperationBtn" )
    const JumpToPath = getComponent("JumpToPath", true)
    const Collapse = getComponent( "Collapse" )
    const Markdown = getComponent( "Markdown" )
    const Schemes = getComponent( "schemes" )

    // Merge in Live Response
    if(response && response.size > 0) {
      let notDocumented = !responses.get(String(response.get("status")))
      response = response.set("notDocumented", notDocumented)
    }

    let { tryItOutEnabled } = this.state
    let shown = this.isShown()
    let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )
    // console.log(onChangeKey);
    return (
        <div className={deprecated ? "opblock opblock-deprecated" : shown ? `opblock opblock-${method} is-open` : `opblock opblock-${method}`} id={isShownKey} >
          <div className={`opblock-summary opblock-summary-${method}`} onClick={this.toggleShown} >
            <span className="opblock-summary-method">{method.toUpperCase()}</span>
            <span className={ deprecated ? "opblock-summary-path__deprecated" : "opblock-summary-path" } >
              <span>{path}</span>
              <JumpToPath path={jumpToKey} />
            </span>

            { !showSummary ? null :
                <div className="opblock-summary-description">
                  { summary }
                </div>
            }

            {
              (!security || !security.count()) ? null :
                <AuthorizeOperationBtn authActions={ authActions }
                  security={ security }
                  authSelectors={ authSelectors }/>
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
                onChangeKey={onChangeKey}
                onTryoutClick = { this.onTryoutClick }
                onCancelClick = { this.onCancelClick }
                tryItOutEnabled = { tryItOutEnabled }
                allowTryItOut={allowTryItOut}

                fn={fn}
                getComponent={ getComponent }
                specActions={ specActions }
                specSelectors={ specSelectors }
                pathMethod={ [path, method] }
                hooks={ [this.clearHookData, this.addHook ] }/>

              {!tryItOutEnabled || !allowTryItOut ? null : schemes && schemes.size ? <div className="opblock-schemes">
                    <Schemes schemes={ schemes }
                             path={ path }
                             method={ method }
                             specActions={ specActions }/>
                  </div> : null
              }

            <div className={(!tryItOutEnabled || !response || !allowTryItOut) ? "execute-wrapper" : "btn-group"}>
              { !tryItOutEnabled || !allowTryItOut ? null :

                  <Execute
                    getComponent={getComponent}
                    operation={ operation }
                    specActions={ specActions }
                    specSelectors={ specSelectors }
                    authSelectors= { authSelectors }
                    path={ path }
                    method={ method }
                    onExecute={ this.onExecute }
                    getHookData={ this.getHookData } />
              }

              { (!tryItOutEnabled || !response || !allowTryItOut) ? null :
                  <Clear
                    onClick={ this.onClearClick }
                    specActions={ specActions }
                    path={ path }
                    method={ method }/>
              }
            </div>

            {this.state.executeInProgress ? <div className="loading-container"><div className="loading"></div></div> : null}

              { !responses ? null :
                  <Responses
                    responses={ responses }
                    request={ request }
                    tryItOutResponse={ response }
                    getComponent={ getComponent }
                    specSelectors={ specSelectors }
                    specActions={ specActions }
                    produces={ produces }
                    producesValue={ operation.get("produces_value") }
                    pathMethod={ [path, method] }
                    fn={fn} />
              }
            </div>
          </Collapse>
        </div>
    )
  }

}
