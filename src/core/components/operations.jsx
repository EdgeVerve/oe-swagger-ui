import React, { PropTypes } from "react"

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  };

  static defaultProps = {

  };

  shouldComponentUpdate(nextProps) {
    
    // console.assert(getState, 'getstate not available')
    if (this.previousState) {
      let previous = this.previousState["operations-tag"]
      let { getState } = nextProps
      let layout = getState().get("layout").toJS()
      
      if (layout.shown) {
        let tags = layout.shown["operations-tag"]
        if (tags) {
          let res = Object.keys(tags).some( key => tags[key] !== previous[key])
          console.log('Operations Render required:', res)  
          return res
        }
        
      }

    }

    return true
  }

  render() {
    console.log('Render Operations')
    let {
      specSelectors,
      specActions,
      getComponent,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors,
      getConfigs,
      fn
    } = this.props

    // deostroll - ideally this change should be refactored out
    // and made into a component in the oecloud folder

    let taggedOps = specSelectors.taggedOperations().sort(function(a, b) {
      let left = a.toJS().tagDetails.name.toLowerCase()
      let right = b.toJS().tagDetails.name.toLowerCase()
      return left.localeCompare(right)
    })
    
    const Operation = getComponent("operation")
    const Collapse = getComponent("Collapse")

    let showSummary = layoutSelectors.showSummary()
    let { docExpansion } = getConfigs()
    this.previousState = { "operations-tag" : {} }
    return (
        <div>
          {
            taggedOps.map( (tagObj, tag) => {
              let operations = tagObj.get("operations")
              let tagDescription = tagObj.getIn(["tagDetails", "description"], null)

              let isShownKey = ["operations-tag", tag]
              // console.log(isShownKey)
              let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")
              // this.previousState[isShownKey.join(".")] = showTag
              this.previousState["operations-tag"][tag] = showTag

              return (
                <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} key={"operation-" + tag}>

                  <h4 onClick={() => layoutActions.show(isShownKey, !showTag)} className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }>
                    <span>{tag}</span>
                    { !tagDescription ? null :
                        <small>
                          { tagDescription }
                        </small>
                    }

                    <button className="expand-operation" title="Expand operation" onClick={() => layoutActions.show(isShownKey, !showTag)}>
                      <svg className="arrow" width="20" height="20">
                        <use xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
                      </svg>
                    </button>
                  </h4>

                  <Collapse isOpened={showTag}>
                    {
                      operations.map( op => {

                        const isShownKey = ["operations", op.get("id"), tag]
                        const path = op.get("path", "")
                        const method = op.get("method", "")
                        const jumpToKey = `paths.${path}.${method}`

                        const allowTryItOut = specSelectors.allowTryItOutFor(op.get("path"), op.get("method"))
                        const response = specSelectors.responseFor(op.get("path"), op.get("method"))
                        const request = specSelectors.requestFor(op.get("path"), op.get("method"))

                        return <Operation
                          {...op.toObject()}

                          isShownKey={isShownKey}
                          jumpToKey={jumpToKey}
                          showSummary={showSummary}
                          key={isShownKey}
                          response={ response }
                          request={ request }
                          allowTryItOut={allowTryItOut}

                          specActions={ specActions }
                          specSelectors={ specSelectors }

                          layoutActions={ layoutActions }
                          layoutSelectors={ layoutSelectors }

                          authActions={ authActions }
                          authSelectors={ authSelectors }

                          getComponent={ getComponent }
                          fn={fn}
                          getConfigs={ getConfigs }
                        />
                      }).toArray()
                    }
                  </Collapse>
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
