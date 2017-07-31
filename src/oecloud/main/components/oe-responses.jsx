import React, { PropTypes } from "react"
import { fromJS } from "immutable"
import { defaultStatusCode } from "core/utils"

export default class OeResponses extends React.Component {

  static defaultProps = {
    request: null,
    tryItOutResponse: null,
    produces: fromJS(["application/json"])
  }

  constructor(...args) {
    super(...args)

    this.state = {
      producesValue: this.props.producesValue
    }

  }

  onContentTypeChange = (e) => {
    let ctrl = e.target
    let index = ctrl.selectedIndex
    let value = ctrl.options[index].value
    let { setCacheData } = this.props

    setCacheData("produces_value", value)

    this.setState({
      producesValue: value
    })
  }

  renderContentType(producesValue, produces) {
    return (
      <select className="execute-content-type" onChange={this.onContentTypeChange} defaultValue={producesValue}>
        {
          produces.map(p => {
            return <option key={ p }
                      value={p}
                    >
                      {p}
                    </option>
          })
        }
      </select>
    )
  }

  render() {
// console.log    console.log("RENDER: OeResponses")
    let { responses, request, response, getComponent, specSelectors, fn } = this.props
    let defaultCode = defaultStatusCode( responses )
    let producesValue = this.state.producesValue

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : OeResponses.defaultProps.produces

    return (
      <div className="responses-wrapper">

        <div className="responses-inner">
          {
            !response ? null
                              : <div>
                                  <LiveResponse request={ request }
                                                response={ response }
                                                getComponent={ getComponent } />

                                </div>

          }
        </div>
      </div>
    )
  }
}
