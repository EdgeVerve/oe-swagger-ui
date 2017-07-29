import React, { Component, PropTypes } from "react"
import win from "core/window"


export default class OeParameterRow extends Component {

  constructor(...args) { super(...args) }

  refCallback = (ctrl) => {
    let { opToolbox: { addHook }, param } = this.props

    addHook(param.get(name), ctrl)
  }



  renderTextArea(consumes, opToolbox, getComponent, param, fn) {

    let ParamBody = getComponent("OeParamBody")

    return (
      <ParamBody consumes={ consumes } opToolbox={ opToolbox } fn={ fn } param={ param } />
    )
  }

  renderRequiredInput(param) {
    let type = param.get("type")
    let enumValue = param.get("enum")
    let required = param.get("required")

    if (enumValue) {
      return (
        <select ref= { this.refCallback }>
          {
            required ? null : <option value="">--</option>
          }
          {
            enumValue.map(en => {
              return <option value={en}>{en}</option>
            })
          }
        </select>
      )
    }

    const isDisabled = param.get("in") === "formData" && !("FormData" in window)

    if (type === "file") {

      return (
        <input type="file" ref={ this.refCallback } disabled={isDisabled} />
      )
    }
    let description = param.get("description") ? `${param.get("name")} - ${param.get("description")}` : `${param.get("name")}`
    let format = param.get("format")
    return (
      <input type={ format === "password" ? "password" : "text" } placeholder={ description } disabled={isDisabled} />
    )


  }


  render() {
    console.log("RENDER: OeParameterRow")
    let { param, opToolbox, getComponent, consumes, fn } = this.props

    let inType = param.get("in")
    let Markdown = getComponent("Markdown")
    let isFormData = inType === "formData"
    let isFormDataSupported = "FormData" in win
    let required = param.get("required")
    let itemType = param.getIn(["items", "type"])

    return (
      <tr>
        <td className="col parameters-col_name">
          <div className={required ? "parameter__name required" : "parameter__name"}>
            { param.get("name") }
            { !required ? null : <span style={{color: "red"}}>&nbsp;*</span> }
          </div>
          <div className="parаmeter__type">{ param.get("type") } { itemType && `[${itemType}]` }</div>
          <div className="parameter__in">({ param.get("in") })</div>
        </td>

        <td className="col parameters-col_description">
          <Markdown source={ param.get("description") } />
          {(isFormData && !isFormDataSupported) && <div>Error: your browser does not support FormData</div>}

          {
            inType === "body" ? this.renderTextArea(consumes, opToolbox, getComponent, param, fn) : null
          }

          {
            inType !== "body" ? this.renderRequiredInput(param) : null
          }
        </td>
      </tr>
    )
  }
}
