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
    console.log("RENDER: OeResponses")
    let { responses, request, response, getComponent, specSelectors, fn } = this.props
    let defaultCode = defaultStatusCode( responses )
    let producesValue = this.state.producesValue

    const ContentType = getComponent( "contentType" )
    const LiveResponse = getComponent( "liveResponse" )
    const Response = getComponent( "response" )

    let produces = this.props.produces && this.props.produces.size ? this.props.produces : OeResponses.defaultProps.produces

    return (
      <div className="responses-wrapper">
        <div className="opblock-section-header">
          <h4>Responses</h4>
            <label>
              <span>Response content type</span>
              {
                this.renderContentType(producesValue, produces)
              }
            </label>
        </div>
        <div className="responses-inner">
          {
            !response ? null
                              : <div>
                                  <LiveResponse request={ request }
                                                response={ response }
                                                getComponent={ getComponent } />
                                  <h4>Responses</h4>
                                </div>

          }

          <table className="responses-table">
            <thead>
              <tr className="responses-header">
                <td className="col col_header response-col_status">Code</td>
                <td className="col col_header response-col_description">Description</td>
              </tr>
            </thead>
            <tbody>
              {
                responses.entrySeq().map( ([code, response]) => {

                  let className = response && response.get("status") == code ? "response_current" : ""
                  return (
                    <Response key={ code }
                              isDefault={defaultCode === code}
                              fn={fn}
                              className={ className }
                              code={ code }
                              response={ response }
                              specSelectors={ specSelectors }
                              contentType={ producesValue }
                              getComponent={ getComponent }/>
                    )
                }).toArray()
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
