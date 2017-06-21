import React, { Component, PropTypes } from "react"
import win from "core/window"
import ParamBody from "./param-body"

export default class ParameterRow extends Component {
  static propTypes = {

    param: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    pathMethod: PropTypes.array.isRequired,

  }

  // constructor(props, context) {
  //   super(props, context)
  //
  //   let { specSelectors, pathMethod, param } = props
  //   let defaultValue = param.get("default")
  //   let parameter = specSelectors.getParameter(pathMethod, param.get("name"))
  //   let value = parameter ? parameter.get("value") : ""
  //   if ( defaultValue !== undefined && value === undefined ) {
  //     this.onChangeWrapper(defaultValue)
  //   }
  // }

  // componentWillReceiveProps(props) {
  //   let { specSelectors, pathMethod, param } = props
  //   let example = param.get("example")
  //   let defaultValue = param.get("default")
  //   let parameter = specSelectors.getParameter(pathMethod, param.get("name"))
  //   let paramValue = parameter ? parameter.get("value") : undefined
  //   let enumValue = parameter ? parameter.get("enum") : undefined
  //   let value
  //
  //   if ( paramValue !== undefined ) {
  //     value = paramValue
  //   } else if ( example !== undefined ) {
  //     value = example
  //   } else if ( defaultValue !== undefined) {
  //     value = defaultValue
  //   } else if ( param.get("required") && enumValue && enumValue.size ) {
  //     value = enumValue.first()
  //   }
  //
  //   if ( value !== undefined ) {
  //     this.onChangeWrapper(value)
  //   }
  // }

  // onChangeWrapper = (value) => {
  //   let { onChange, param } = this.props
  //   return onChange(param, value)
  // }

  render() {
    let {param, getComponent, specSelectors, pathMethod } = this.props
    // console.log('from para-row render',getParam());
    // const onChangeWrapper = (value) => onChange(param, value)
    const JsonSchemaForm = getComponent("JsonSchemaForm")
    // const ParamBody = getComponent("ParamBody")
    let inType = param.get("in")
    let bodyParam = inType !== "body" ? null
      : <ParamBody getComponent={getComponent}
                   param={param}
                   consumes={ specSelectors.operationConsumes(pathMethod) }
                   consumesValue={ specSelectors.contentTypeValues(pathMethod).get("requestContentType") }
                   specSelectors={ specSelectors }
                   pathMethod={ pathMethod } />

    const ModelExample = getComponent("modelExample")
    const Markdown = getComponent("Markdown")

    let schema = param.get("schema")

    let isFormData = inType === "formData"
    let isFormDataSupported = "FormData" in win
    let required = param.get("required")
    let itemType = param.getIn(["items", "type"])
    // let parameter = specSelectors.getParameter(pathMethod, param.get("name"))
    // let value = parameter ? parameter.get("value") : ""
    // let p = getParam()
    // console.log('getParam():', p);
    // console.log('param.get("name"):', key)
    // let { value } = p[param.get("name")] ? p[param.get("name")] : { value: undefined }
    let value = undefined
    // console.log('value:', value);
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
          <Markdown source={ param.get("description") }/>
          {(isFormData && !isFormDataSupported) && <div>Error: your browser does not support FormData</div>}

          { bodyParam ? null
            : <JsonSchemaForm getComponent={getComponent}
                              value={ value }
                              required={ required }
                              description={param.get("description") ? `${param.get("name")} - ${param.get("description")}` : `${param.get("name")}`}
                              schema={ param }
                              key={param.get("name")}/>
          }


          {
            bodyParam && schema ? <ModelExample getComponent={ getComponent }
                                                specSelectors={ specSelectors }
                                                schema={ schema }
                                                example={ bodyParam }/>
              : null
          }

        </td>

      </tr>
    )

  }

}
