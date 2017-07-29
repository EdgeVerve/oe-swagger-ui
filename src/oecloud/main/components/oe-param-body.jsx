import React from "react"
import { getSampleSchema } from "core/utils"

const isXml = (val) => /xml/i.test(val)

export default class OeParamBody extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.cache = {}
    this.state = {
      bodyContent: ""
    }
  }

  refCallback = (ctrl) => {
    // console.log('refCb')
    let { opToolbox , param } = this.props
    this.cache["ctrl"] = ctrl
    // console.log(this.props)
    opToolbox.addHook(param.get("name"), ctrl)
  }

  // tbxChange = (e) => {
  //   let { value } = e.target
  //   this.setState({ bodyContent: value })
  //   console.log("change")
  // }

  clear = () => {
    this.cache["ctrl"].value = ""
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
  }

  render() {
    console.log("RENDER: OeParamBody")
    let { opToolbox , consumes, param } = this.props
    let handleChange = (e) => {
      let select = e.target
      let i = select.selectedIndex
      let v = select.options[i].value
      this.setConsumesValue(v)
      opToolbox.setCacheData("consumes_value", v)
    }

    return (
      <div>
        <div>
          <ul className="tab">
            <li className="tabitem">
              <a className="tablinks" data-name="example" onClick={ this.loadExample }>Example Value</a>
            </li>
            <li className="tabitem">
              <a className="tablinks" data-name="clear" onClick={ this.clear } >Clear</a>
            </li>
          </ul>
        </div>
        <div>
          <textarea className="body-param__text" ref={ this.refCallback } /*value={ this.state.bodyContent } onChange={ this.tbxChange }*/></textarea>
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
      </div>

    )
  }
}
