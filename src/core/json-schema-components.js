import React, { PropTypes, Component } from "react"
import shallowCompare from "react-addons-shallow-compare"
import { List, fromJS } from "immutable"
//import "less/json-schema-form"

const noop = ()=> {}
const JsonSchemaPropShape = {
  getComponent: PropTypes.func.isRequired,
  value: PropTypes.any,
  hooks: PropTypes.array,
  keyName: PropTypes.any,
  fn: PropTypes.object.isRequired,
  schema: PropTypes.object,
  required: PropTypes.bool,
  description: PropTypes.any
}

const JsonSchemaDefaultProps = {
  value: "",
  onChange: noop,
  schema: {},
  keyName: "",
  required: false
}

export class JsonSchemaForm extends Component {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  render() {
    let { schema, value, hooks, getComponent, fn } = this.props

    if(schema.toJS)
      schema = schema.toJS()

    let { type, format="" } = schema

    let Comp = getComponent(`JsonSchema_${type}_${format}`) || getComponent(`JsonSchema_${type}`) || getComponent("JsonSchema_string")
    return <Comp { ...this.props } 
      fn={ fn } 
      getComponent={ getComponent } 
      value={ value } 
      schema={ schema } 
      hooks={ hooks }
      />
  }

}

export class JsonSchema_string extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps
  onChange = (e) => {
    // console.log(this);
    const value = this.props.schema["type"] === "file" ? e.target.files[0] : e.target.value
    this.props.onChange(value, this.props.keyName)
  }
  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, value, schema, required, description, hooks } = this.props
    let enumValue = schema["enum"]
    let errors = schema.errors || []
    // console.log('json_schema_string render:', value);
    if ( enumValue ) {
      const Select = getComponent("Select")
    let [ clearHookData, addHook ] = hooks
    clearHookData()
      return (<Select allowedValues={ enumValue }
                      value={ value }
                      allowEmptyValue={ !required }
                      onLoad={ (e) => addHook(schema.name, e.target ) }/>)
    }

    const isDisabled = schema["in"] === "formData" && !("FormData" in window)
    const Input = getComponent("Input")
    if (schema["type"] === "file") {
      return <Input type="file" className={ errors.length ? "invalid" : ""} onLoad={ (e) => addHook(schema.name, e.target ) } disabled={isDisabled}/>
    }
    else {
      return <Input type={ schema.format === "password" ? "password" : "text" } className={ errors.length ? "invalid" : ""} value={value} placeholder={description} onLoad={ (e) => addHook(schema.name, e.target ) } disabled={isDisabled}/>
    }
  }
}

export class JsonSchema_array extends Component {

  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  constructor(props, context) {
    super(props, context)
    this.state = {value: props.value}
  }

  componentWillReceiveProps(props) {
    if(props.value !== this.state.value)
      this.setState({value: props.value})
  }

  shouldComponentUpdate(props, state) {
    return shallowCompare(this, props, state)
  }

  onChange = () => this.props.onChange(this.state.value)

  onItemChange = (itemVal, i) => {
    this.setState(state => ({
      value: state.value.set(i, itemVal)
    }), this.onChange)
  }

  removeItem = (i) => {
    this.setState(state => ({
      value: state.value.remove(i)
    }), this.onChange)
  }

  addItem = () => {
    this.setState(state => {
      state.value = state.value || List()
      return {
        value: state.value.push("")
      }
    }, this.onChange)
  }

  onEnumChange = (value) => {
    this.setState(() => ({
      value: value
    }), this.onChange)
  }

  render() {
    let { getComponent, required, schema, fn } = this.props

    let itemSchema = fn.inferSchema(schema.items)

    const JsonSchemaForm = getComponent("JsonSchemaForm")
    const Button = getComponent("Button")

    let enumValue = itemSchema["enum"]
    let value = this.state.value

    if ( enumValue ) {
      const Select = getComponent("Select")
      return (<Select multiple={ true }
                     value={ value }
                     allowedValues={ enumValue }
                     allowEmptyValue={ !required }
                     onChange={ this.onEnumChange }/>)
    }

    let errors = schema.errors || []

    return (
      <div>
        { !value || value.count() < 1 ?
          (errors.length ? <span style={{ color: "red", fortWeight: "bold" }}>{ errors[0] }</span> : null) :
          value.map( (item,i) => {
            let schema = Object.assign({}, itemSchema)
            if ( errors.length ) {
              let err = errors.filter((err) => err.index === i)
              if (err.length) schema.errors = [ err[0].error + i ]
            }
          return (
            <div key={i} className="json-schema-form-item">
              <JsonSchemaForm fn={fn} getComponent={getComponent} value={item} onChange={(val) => this.onItemChange(val, i)} schema={schema} />
              <Button className="json-schema-form-item-remove" onClick={()=> this.removeItem(i)} > - </Button>
            </div>
            )
          }).toArray()
        }
        <Button className="json-schema-form-item-add" onClick={this.addItem}> Add item </Button>
      </div>
    )
  }
}

export class JsonSchema_boolean extends Component {
  static propTypes = JsonSchemaPropShape
  static defaultProps = JsonSchemaDefaultProps

  onEnumChange = (val) => this.props.onChange(val)
  render() {
    let { getComponent, required, value } = this.props
    const Select = getComponent("Select")

    return (<Select value={ String(value) }
                    allowedValues={ fromJS(["true", "false"]) }
                    allowEmptyValue={ !required }
                    onChange={ this.onEnumChange }/>)
  }
}
