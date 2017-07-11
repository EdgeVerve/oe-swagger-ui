import React, { Component, PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

export default class Parameters extends Component {

  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeKey: PropTypes.array,
    pathMethod: PropTypes.array.isRequired,
    hooks: PropTypes.array
  }

  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
  }

  

  onChange = ( param, value, isXml ) => {
    // let {
    //   specActions: { changeParam },
    //   onChangeKey,
    // } = this.props
    //
    // changeParam( onChangeKey, param.get("name"), value, isXml)
    // console.log(this)
    let {
      updateParam
    } = this.props

    updateParam(param.get("name"), { value, isXml })
  }

  onChangeConsumesWrapper = ( val ) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  render(){

    let {
      onTryoutClick,
      onCancelClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,

      fn,
      getComponent,
      specSelectors,
      pathMethod,
      hooks
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")

    const isExecute = tryItOutEnabled && allowTryItOut

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <h4 className="opblock-title">Parameters</h4>
            { allowTryItOut ? (
              <TryItOutButton enabled={ tryItOutEnabled } onCancelClick={ onCancelClick } onTryoutClick={ onTryoutClick } />
            ) : null }
        </div>
        { !parameters.count() ? <div className="opblock-description-wrapper"><p>No parameters</p></div> :
          <div className="table-container">
            <table className="parameters">
              <thead>
                <tr>
                  <th className="col col_header parameters-col_name">Name</th>
                  <th className="col col_header parameters-col_description">Description</th>
                </tr>
              </thead>
              <tbody>
                {
                  // this is a small hack for not allowing
                  // react to render a ui for inputting
                  // "access_token" - any thoughts?!!
                  eachMap(parameters, (parameter) => (
                    parameter.get("name") === "access_token" ? null : <ParameterRow fn={ fn }
                      getComponent={ getComponent }
                      param={ parameter }
                      key={ parameter.get( "name" ) }
                      specSelectors={ specSelectors }
                      pathMethod={ pathMethod }
                      isExecute={ isExecute }
                      hooks={ hooks} />
                  )).toArray()
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    )
  }
}
