import React, { PropTypes } from "react"
import Operation from "./operation"

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,

    getComponent: PropTypes.func.isRequired,

  };

  static defaultProps = {

  };

  render() {
    let {
      specSelectors,
      getComponent
    } = this.props

    let taggedOps = specSelectors.taggedOperations()

    const Collapse = getComponent("Collapse")

    let showSummary = true
    // let { docExpansion } = getConfigs()

    return (
        <div>
          {
            taggedOps.map( (tagObj, tag) => {
              let operations = tagObj.get("operations")
              let tagDescription = tagObj.getIn(["tagDetails", "description"], null)

              let isShownKey = ["operations-tag", tag]

              // let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")
              let showTag = true

              return (
                <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} key={"operation-" + tag}>

                  <h4 className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }>
                    <span>{tag}</span>
                    { !tagDescription ? null :
                        <small>
                          { tagDescription }
                        </small>
                    }
                  </h4>

                  <div>
                    {
                      operations.map( op => {


                        const path = op.get("path", "")
                        const method = op.get("method", "")
                        const jumpToKey = `paths.${path}.${method}`

                        return <Operation
                          {...op.toObject() }
                          specSelectors={ specSelectors }
                          getComponent={ getComponent }
                        />
                      }).toArray()
                    }
                  </div>
                </div>
                )
            }).toArray()
          }

          { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
        </div>
    )
  }

}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
