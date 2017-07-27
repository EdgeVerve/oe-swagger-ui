import React, { PropTypes } from "react"

export default class TaggedOp extends React.Component {
	static propTypes = {

		operations: PropTypes.object.isRequired,
		tagDescription: PropTypes.string,
    isShownKey: PropTypes.array.isRequired,
    expand: PropTypes.bool.isRequired,
    tag: PropTypes.string.isRequired,

		layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,

    getComponent: PropTypes.func.isRequired
	}

  shouldComponentUpdate(nextProps) {
    if (this.previousState) {
      let { layoutSelectors, isShownKey, expand } = nextProps
      let showTag = layoutSelectors.isShown(isShownKey, expand)
      let res = this.previousState.showTag !== showTag
      console.log('TaggedOp should update:', res, 'Key:', isShownKey)
      return res
    }
    return true
  }

	render() {

    let {

      operations,
      tagDescription,
      isShownKey,
      expand,
      tag,
      layoutSelectors,
      layoutActions,
      specSelectors,
      specActions,
      getComponent,
      fn,
      getConfigs

    } = this.props

		let showTag = layoutSelectors.isShown(isShownKey, expand)
    let Operation = getComponent("OeOperation")
    let Collapse = getComponent("Collapse")
    let showSummary = layoutSelectors.showSummary()
    this.previousState = { showTag: showTag }
		return (
        <div className={ showTag ? "opblock-tag-section is-open" : "opblock-tag-section" }>
          <h4 onClick={ () => layoutActions.show(isShownKey, !showTag) } className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }>
            <span>{ tag }</span>
            {
              !tagDescription ? null: <small>{ tagDescription }</small>
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

                const response = specSelectors.responseFor(path, method)
                const request = specSelectors.requestFor(path, method)
                const allowTryItOut = specSelectors.allowTryItOutFor(path, method)
                return <Operation
                  key={ isShownKey }

                  { ...op.toObject() }
                  isShownKey={ isShownKey }
                  showSummary={ showSummary }
                  layoutSelectors={ layoutSelectors }
                  specSelectors={ specSelectors }

                  specActions={ specActions }
                  layoutActions={ layoutActions }

                  response={ response }
                  request={ request }
                  allowTryItOut={ allowTryItOut }

                  fn={fn}
                  getConfigs={ getConfigs }
                  getComponent={ getComponent }
                />

              })
            }
          </Collapse>

        </div>
			)
	}
}
