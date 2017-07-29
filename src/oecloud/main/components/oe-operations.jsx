import React, { PropTypes } from "react"
import Im from "immutable"
// import TaggedOp from "./tagged-op"

export default class OeOperations extends React.Component {

  render() {
    console.log('RENDER: OeOperations')
    let {
      toolbox
    } = this.props

    let { specSelectors } = toolbox
    let taggedOps = specSelectors.getTaggedOpsSorted() // this is expensive

    const Tag = toolbox.getToolBoxedComponent("OeTag")
    const Collapse = toolbox.getComponent("Collapse")
    // console.log("Tag:", Tag)
    return (
      <div>
        {
          taggedOps.map ( (tagObj, tag) => {
            let operations = tagObj.get("operations")
            let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
            // let isShownKey = ["operations-tag", tag]
            return <Tag
              key={ tag }
              operations={ operations }
              tagName={ tag }
              tagDesc={ tagDescription }
              />
          })
        }
      </div>
    )
  }

}
