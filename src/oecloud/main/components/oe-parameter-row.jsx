import React, { Component, PropTypes } from "react"
import win from "core/window"


export default class OeParameterRow extends Component {

  constructor(...args) {
    super(...args)

    this.state= {
      value: this.props.value || ""
    }
  }

  onChange = (e) => {
    let ctrl = e.target
    let value;

    if (ctrl instanceof HTMLSelectElement) {
      let index = ctrl.selectedIndex
      value = ctrl.options[index].value
    }
    else {
      value = ctrl.value
    }

    this.setState({
      value: value
    })

    let { opToolbox, param } = this.props

    let name = param.get("name")

    opToolbox.updateParam(name, value)

  }

  renderTextArea(consumes, opToolbox, getComponent, param, fn, specSelectors, consumesValue) {

    let ParamBody = getComponent("OeParamBody")

    return (
      <ParamBody consumes={ consumes }
        opToolbox={ opToolbox }
        fn={ fn } param={ param }
        getComponent={getComponent}
        specSelectors={ specSelectors }
        value={ this.state.value }
        consumesValue={ consumesValue }
      />
    )
  }

  renderRequiredInput(param) {
    let type = param.get("type")
    let enumValue = param.get("enum")
    let required = param.get("required")

    if (enumValue) {
      return (
        <select onChange={ this.onChange } defaultValue={this.state.value}>
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
        <input type="file" onChange={ this.onChange }
          disabled={isDisabled}
        />
      )
    }
    let description = param.get("description") ? `${param.get("name")} - ${param.get("description")}` : `${param.get("name")}`
    let format = param.get("format")
    return (
      <input type={ format === "password" ? "password" : "text" }
        placeholder={ description }
        disabled={isDisabled}
        value={ this.state.value }
        onChange={ this.onChange }
      />
    )


  }


  render() {
// console.log    console.log("RENDER: OeParameterRow")
    let { param, opToolbox, getComponent, consumes, fn, specSelectors, value, consumesValue } = this.props

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
          <Markdown source={ param.get("description") || "" } />
          {(isFormData && !isFormDataSupported) && <div>Error: your browser does not support FormData</div>}

          {
            inType === "body" ? this.renderTextArea(consumes, opToolbox, getComponent, param, fn, specSelectors, value, consumesValue) : null
          }

          {
            inType !== "body" ? this.renderRequiredInput(param, value) : null
          }
        </td>
      </tr>
    )
  }
}
