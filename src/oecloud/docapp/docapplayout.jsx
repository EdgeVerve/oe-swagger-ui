import React, { PropTypes } from "react"
import DocAppBaseLayout from "./layout/docappbase"

export default class DocAppLayout extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let { getComponent, specSelectors } = this.props

    let Container = getComponent("Container")

    const loadingStatus = specSelectors.loadingStatus()

    return (
      <Container className='swagger-ui'>
        { loadingStatus === "loading" &&
          <div className="info">
            <h4 className="title">Loading...</h4>
          </div>
        }
        { loadingStatus === "failed" &&
          <div className="info">
            <h4 className="title">Failed to load spec.</h4>
          </div>
        }
        { loadingStatus === "failedConfig" &&
          <div className="info" style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
            <h4 className="title">Failed to load config.</h4>
          </div>
        }
        { !loadingStatus || loadingStatus === "success" && <DocAppBaseLayout getComponent={ getComponent } specSelectors={ specSelectors } /> }

      </Container>
    )
  }

}
