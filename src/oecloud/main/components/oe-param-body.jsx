import React from "react"
import { getSampleSchema } from "core/utils"

const isXml = (val) => /xml/i.test(val)

export default class OeParamBody extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.cache = {}
    this.state = {
      currentTab: "input"
    }
  }

  refCallback = (ctrl) => {
    // console.log('refCb')
    let { opToolbox , param } = this.props
    this.cache["ctrl"] = ctrl
    // console.log(this.props)
    opToolbox.addHook(param.get("name"), ctrl)
  }

  clear = () => {
    this.cache["ctrl"].value = ""
    this.setState({currentTab: "input"})
  }

  getSample = (xml) => {
    let { param, fn: { inferSchema } } = this.props
    let schema = inferSchema(param.toJS())
    return getSampleSchema(schema, xml)
  }

  setConsumesValue = (value) => { this.cache["consumes_value"] = value }

  getExample() {
    let consumesValue = this.cache["consumes_value"] || this.props.consumes.get(0)
    return this.getSample(consumesValue)
  }

  loadExample = () => {
    this.cache["ctrl"].value = this.getExample()
    this.setState({
      currentTab: "input"
    })
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
    console.log("RENDER: OeParamBody")
    let { opToolbox , consumes, param, getComponent, specSelectors } = this.props
    let schema = param.get("schema")
    let handleChange = (e) => {
      let select = e.target
      let i = select.selectedIndex
      let v = select.options[i].value
      this.setConsumesValue(v)

      //TODO: move this to parent component state
      opToolbox.setCacheData("consumes_value", v)
    }

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

            <li className="tabitem">
              <a className="tablinks" data-name="clear" onClick={ this.loadExample } >Load Example</a>
            </li>
            <li className="tabitem">
              <a className="tablinks" data-name="clear" onClick={ this.clear } >Clear</a>
            </li>
          </ul>
        </div>
        <div style={ {display: this.state.currentTab === "input" ? "block" : "none"} }>
          <textarea className="body-param__text" ref={ this.refCallback }></textarea>
          <div>
            <label>
                <small><strong>Parameter content type</strong></small>
                <div className="content-type-wrapper body-param-content-type">
                  <select className="content-type" onChange={ handleChange }>
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
