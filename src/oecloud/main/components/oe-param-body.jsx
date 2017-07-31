import React from "react"
import { getSampleSchema } from "core/utils"

const isXml = (val) => /xml/i.test(val)

export default class OeParamBody extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.cache = {}
    let value = props.value

    value = value || (value.length ? value : this.getExample())
    this.state = {
      currentTab: "input",
      bodyContent: value
    }
  }

  onTxtChange = (e) => {
    let {opToolbox, param} = this.props

    this.setState({
      bodyContent: e.target.value
    })

    opToolbox.updateParam(param.get("name"), e.target.value)
  }

  onContentTypeChange = (e) => {
    let select = e.target
    let i = select.selectedIndex
    let v = select.options[i].value


    //TODO: move this to parent component state
    this.props.opToolbox.setCacheData("consumes_value", v)
    this.setConsumesValue(v)
  }

  getSample = (xml) => {
    let { param, fn: { inferSchema } } = this.props
    let schema = inferSchema(param.toJS())
    return getSampleSchema(schema, xml)
  }

  setConsumesValue = (value) => {
    this.cache["consumes_value"] = value //TODO: refactor usage of this.cache...have it in state
    let { opToolbox, param } = this.props
    opToolbox.updateParam(param.get("name"), this.getExample())
    this.setState({
      bodyContent: this.getExample()
    })

  }

  getExample() {
    let consumesValue = this.cache["consumes_value"] || this.props.consumes.get(0)
    return this.getSample(consumesValue)
  }

  showModel = () => {
    this.setState({
      currentTab: "model"
    })
  }

  showInput = () => {
    this.setState({
      currentTab: "input"
    })
  }

  render() {
// console.log    console.log("RENDER: OeParamBody")
    let { opToolbox , consumes, param, getComponent, specSelectors } = this.props
    let schema = param.get("schema")

    let Model = getComponent("model")

    return (
      <div>
        <div>
          <ul className="tab-display">
            <li className={ (this.state.currentTab === "model") ? "tabitem active" : "tabitem" }>
              <a className="tablinks" data-name="example" onClick={ this.showModel }>Show Model</a>
            </li>
            <li className={ (this.state.currentTab === "input") ? "tabitem active" : "tabitem" }>
              <a className="tablinks" data-name="example" onClick={ this.showInput }>
                Show Input
              </a>
            </li>
          </ul>
        </div>
        <div style={ {display: this.state.currentTab === "input" ? "block" : "none"} }>
          <textarea className="body-param__text" value={ this.state.bodyContent } onChange={ this.onTxtChange }></textarea>
          <div>
            <label>
                <small><strong>Parameter content type</strong></small>
                <div className="content-type-wrapper body-param-content-type">
                  <select className="content-type" onChange={ this.onContentTypeChange }>
                    {
                      consumes.map(s => <option key={s} value={s}>{s}</option>)
                    }
                  </select>
                </div>
            </label>
          </div>
        </div>
        <div style={ {display: this.state.currentTab === "model" ? "block" : "none"} }>
          <div style={ { "overflowY" : "auto", "padding": "3px", "maxHeight" : "205px"} }>
            <Model schema={ schema }
             getComponent={ getComponent }
             specSelectors={ specSelectors }
             expandDepth={ 1 } />
          </div>
        </div>
      </div>

    )
  }
}
