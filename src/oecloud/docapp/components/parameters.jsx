import React, { Component, PropTypes } from "react"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import ParameterRow from "./parameter-row"

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
    updateParam: PropTypes.func,
    getParam: PropTypes.func
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
      parameters,
      getComponent,
      specSelectors,
      pathMethod,
    } = this.props
    // console.log('parameters render', getParam());






    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <h4 className="opblock-title">Parameters</h4>
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
                  eachMap(parameters, (parameter) => (
                    <ParameterRow 
                      getComponent={ getComponent }
                      param={ parameter }
                      key={ parameter.get( "name" ) }
                      specSelectors={ specSelectors }
                      pathMethod={ pathMethod } />
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
