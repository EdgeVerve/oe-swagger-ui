import React, { PropTypes } from "react"
import {sorters} from "core/utils"

export default class OeTag extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = { showTag : false }
  }

  setVisibility = (flag) => {
    this.setState( { showTag : flag } )
  }

  invertVisibility = (current) => this.setVisibility(!current)

  render() {
    console.log("OeTag")
    let { operations, tagName, tagDesc , toolbox } = this.props
    // let getComponent = toolbox.getComponent
    let { getComponent, getToolBoxedComponent } = toolbox

    let Collapse = getComponent("Collapse")
    let TaggedOp = getToolBoxedComponent("OeOperation")
    // console.log('Tag:',this.props)
    let showTag = this.state.showTag
    let operationsSorter = sorters.operationsSorter.alpha
    // console.log("sorter:", operationsSorter)
    return (
        <div className={ "opblock-tag-section" + ( showTag ? " is-open" : "" )}>
          <h4 className="opblock-tag" onClick={ () => this.invertVisibility(showTag) }>
            <span>{tagName}</span>
            <small>{tagDesc}</small>
            <button className="expand-operation" title="Expand operation" onClick={ () => this.invertVisibility(showTag) }>
              <svg className="arrow" width="20" height="20">
                <use xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
              </svg>
            </button>
          </h4>

          <Collapse isOpened={ showTag }>
            {
              operations && operations.size ?
                operations.sort(operationsSorter).map( op => {
                  let method =  op.get("method")
                  let path = op.get("path")
                  let key = ["operations", path, method]
                  return <TaggedOp
                      key={ key }
                      method={method}
                      path={path}
                      operation={ op.get("operation") }
                    />
                })
              :
                ""
            }
          </Collapse>
        </div>
      )
  }
}
