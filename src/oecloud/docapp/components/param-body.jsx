import React, { Component, PropTypes } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { fromJS } from "immutable"
import { getSampleSchema } from "core/utils"
import { inferSchema } from "core/plugins/samples/fn"

const NOOP = Function.prototype

export default class ParamBody extends Component {

  static propTypes = {
    param: PropTypes.object,
    consumes: PropTypes.object,
    consumesValue: PropTypes.string,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired
  };

  static defaultProp = {
    consumes: fromJS(["application/json"]),
    param: fromJS({})
  };

  constructor(props, context) {
    super(props, context)

    this.state = {
      value: "",
      isXml: false
    }

  }

  // componentDidMount() {
  //   this.updateValues.call(this, this.props)
  // }

  // shouldComponentUpdate(props, state) {
  //   return shallowCompare(this, props, state)
  // }

  // updateValues = (props) => {
  //   let { specSelectors, pathMethod, param, consumesValue="" } = props
  //   let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : {}
  //   let isXml = /xml/i.test(consumesValue)
  //   let paramValue = isXml ? parameter.get("value_xml") : parameter.get("value")
  //
  //   if ( paramValue !== undefined ) {
  //     let val = !paramValue && !isXml ? "{}" : paramValue
  //     this.setState({ value: val })
  //     // this.onChange(val, {isXml: isXml, isEditBox: isExecute})
  //   } else {
  //     if (isXml) {
  //       // this.onChange(this.sample("xml"), {isXml: isXml, isEditBox: isExecute})
  //     } else {
  //       // this.onChange(this.sample(), {isEditBox: isExecute})
  //     }
  //   }
  // }

  sample = (xml) => {
    let { param } = this.props
    let schema = inferSchema(param.toJS())

    return getSampleSchema(schema, xml)
  }

  // onChange = (value, { isXml }) => {
  //   // this.setState({value, isEditBox})
  //   // if(flag) this._onChange(value, isXml)
  //   this.setState({ value, isXml })
  // }

  changeContentType = (val) => {
    this.setState({ isXml : /xml/i.test(val)})
  }

  // _onChange = (val, isXml) => { (this.props.onChange || NOOP)(this.props.param, val, isXml) }

  // handleOnChange = e => {
  //   let {consumesValue} = this.props
  //   this.onChange(e.target.value.trim(), {isXml: /xml/i.test(consumesValue)}, true)
  // }
  //
  // toggleIsEditBox = () => this.setState( state => ({isEditBox: !state.isEditBox}))

  render() {
    let {
      // onChangeConsumes,
      // param,
      // isExecute,
      specSelectors,
      pathMethod,
      // getParam,
      getComponent
    } = this.props

    const HighlightCode = getComponent("highlightCode")
    const ContentType = getComponent("contentType")
    // for domains where specSelectors not passed
    // let parameter = specSelectors ? specSelectors.getParameter(pathMethod, param.get("name")) : param

    let consumesValue = specSelectors.contentTypeValues(pathMethod).get("requestContentType")
    let consumes = this.props.consumes && this.props.consumes.size ? this.props.consumes : ParamBody.defaultProp.consumes

    // let { value, isEditBox } = this.state
    // let p = getParam()
    // let v = p[param.get("name")]
    // let v = undefined

    // let { value, isXml } = v ? v : { value: undefined, isXml: /xml/.test(consumesValue) }
    let { value, isXml } = this.state
    // let { isEditBox } = this.state
    // console.log({
    //   isEditBox: isEditBox, isExecute: isExecute, name: pathMethod
    // });
    if (!value) {
      value = isXml ? this.sample("xml") : this.sample()
    }

    return (
      <div className="body-param">
        {
          (value && <HighlightCode className="body-param__example"
                               value={ value }/>)
        }
        <div className="body-param-options">

          <label htmlFor="">
            <span>Parameter content type</span>
            <ContentType value={ consumesValue } contentTypes={ consumes } onChange={ this.changeContentType } className="body-param-content-type" />
          </label>
        </div>

      </div>
    )

  }
}
