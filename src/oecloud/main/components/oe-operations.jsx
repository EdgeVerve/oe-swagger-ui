import React, { PropTypes } from "react"
import Im from "immutable"
import TaggedOp from "./tagged-op"

export default class OeOperations extends React.Component {

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
    // if (this.previousState) {
    //   let {specSelectors} = nextProps
    //   let res = !(this.previousState === specSelectors.spec().get("paths"))
    //   console.log('Operations Should Update:', res)
    //   return res
    // }
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

    this.previousState = specSelectors.spec().get("paths")

    let taggedOps = specSelectors.getTaggedOpsSorted() // this is expensive

    const Operation = getComponent("operation")
    const Collapse = getComponent("Collapse")

    // let showSummary = layoutSelectors.showSummary()
    let { docExpansion } = getConfigs()
    let expandTagDefaultValue = docExpansion === "full" || docExpansion === "list"
    return (
      <div>
        {
          taggedOps.map ( (tagObj, tag) => {
            let operations = tagObj.get("operations")
            let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
            let isShownKey = ["operations-tag", tag]
            return <TaggedOp
              key={ `operation-${tag}`}
              operations={ operations }
              tagDescription={ tagDescription }
              isShownKey={ isShownKey }
              expand={ expandTagDefaultValue }
              tag={ tag }

              layoutSelectors={ layoutSelectors }
              layoutActions={ layoutActions }

              specSelectors={ specSelectors }
              specActions={ specActions }

              getComponent={ getComponent }
              fn={ fn }
              getConfigs= { getConfigs }
              />
          })
        }
      </div>
    )
  }

}

OeOperations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
