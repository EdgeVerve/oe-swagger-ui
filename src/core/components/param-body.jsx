import React, { Component, PropTypes } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { fromJS, List } from "immutable"
import { getSampleSchema } from "core/utils"

const NOOP = Function.prototype

export default class ParamBody extends Component {

  static propTypes = {
    param: PropTypes.object,
    onChangeConsumes: PropTypes.func,
    consumes: PropTypes.object,
    consumesValue: PropTypes.string,
    fn: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    isExecute: PropTypes.bool,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,
    hooks: PropTypes.array.isRequired
  };

  static defaultProp = {
    consumes: fromJS(["application/json"]),
    param: fromJS({}),
    onChange: NOOP,
    onChangeConsumes: NOOP,
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      isEditBox: true,
      value: ""
    }

    this.isDirty = false

  }

  componentDidMount() {
    this.updateValues.call(this, this.props)
  }

  shouldComponentUpdate(props, state) {
    return shallowCompare(this, props, state)
  }

  // componentWillReceiveProps(nextProps) {
  //   let { isShown } = this.props
  //   if (isShown()) {
  //     this.updateValues.call(this, nextProps)
  //   }
  // }

  updateValues = (props) => {
    let { specSelectors, pathMethod, param, isExecute, consumesValue="" } = props
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : {}
    let isXml = /xml/i.test(consumesValue)
    let paramValue = isXml ? parameter.get("value_xml") : parameter.get("value")

    if ( paramValue !== undefined ) {
      let val = !paramValue && !isXml ? "{}" : paramValue
      this.setState({ value: val })
      this.onChange(val, {isXml: isXml, isEditBox: isExecute})
    } else {
      if (isXml) {
        this.onChange(this.sample("xml"), {isXml: isXml, isEditBox: isExecute})
      } else {
        this.onChange(this.sample(), {isEditBox: isExecute})
      }
    }
  }

  sample = (xml) => {
    let { param, fn:{inferSchema} } = this.props
    let schema = inferSchema(param.toJS())

    return getSampleSchema(schema, xml)
  }

  onChange = (value, { isXml }, flag = false) => {
    // this.setState({value, isEditBox})
    if(flag) this._onChange(value, isXml)
  }

  _onChange = (val, isXml) => { (this.props.onChange || NOOP)(this.props.param, val, isXml) }

  handleOnChange = e => {
    let {consumesValue} = this.props
    this.onChange(e.target.value.trim(), {isXml: /xml/i.test(consumesValue)}, true)
  }

  toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  // componentDidMount() {
  //   console.log('DidMount', arguments)
  // }

  // componentDidUpdate() {
  //   console.log('DidUpdate', arguments)
  // }

  render() {
    let {
      onChangeConsumes,
      param,
      isExecute,
      specSelectors,
      pathMethod,
      hooks,
      getComponent
    } = this.props

    const Button = getComponent("Button")
    const TextArea = getComponent("TextArea")
    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")
    // for domains where specSelectors not passed
    let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : param
    let errors = parameter.get("errors", List())
    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes

    let value
    // console.log(consumesValue)
    let isXml = /xml/i.test(consumesValue)
    let { isEditBox } = this.state

    let [ clearHookData, addHook ] = hooks

    // if (!this.isDirty) {
    //   value = isXml ? this.sample("xml") : this.sample()
    // }

    value = isXml ? this.sample("xml") : this.sample()   

    clearHookData()

    return (
      <div className="body-param">
        {
          isEditBox && isExecute
            ? <TextArea className={ "body-param__text" + ( errors.count() ? " invalid" : "")} defaultValue={value} onChange={ () => this.isDirty = true } refCb={ (e) => addHook(param.get("name"), e, isXml ) }/>
            : (value && <HighlightCode className="body-param__example"
                               value={ value }/>)
        }
        <div className="body-param-options">
          {
            !isExecute ? null
                       : <div className="body-param-edit">
                        <Button className={isExecute ? "btn cancel body-param__example-edit" : "btn edit body-param__example-edit"}
                                 onClick={this.toggleIsEditBox}>{ isEditBox ? "Cancel" : "Edit"}
                         </Button>
                         </div>
          }
          <label htmlFor="">
            <span>Parameter content type</span>
            <ContentType value={ consumesValue } contentTypes={ consumes } onChange={onChangeConsumes} className="body-param-content-type" />
          </label>
        </div>

      </div>
    )

  }
}
