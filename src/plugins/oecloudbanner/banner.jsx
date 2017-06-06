import React, { PropTypes } from "react"
import window from 'core/window'

const lsKey = "swagger_accessToken"

export default class Banner extends React.Component {

  constructor(props, context) {
    super(props, context)
    // let token = this.getAccessToken();
    this.state = { access_token: null }
  }

  componentDidMount() {
    console.log('once');
    if (window.localStorage) {
      let key = window.localStorage.getItem(lsKey);
      if (key) {
        this.updateToken(key)
      }
    }
  }

  setAccessToken(e) {

    let { access_token } = this.state

    this.updateToken(access_token)

    if(e) e.preventDefault();
  }

  updateToken(token) {
    let { authActions } = this.props
    authActions.updateAccessToken(token)
  }

  onTextChange(e) {
    let {target: {value} } = e;
    this.setState({
      access_token: value
    });
  }

  getAccessToken() {
    if (window.localStorage) {
      let key = window.localStorage.getItem(lsKey);
      if (key) {
        return key;
      }
    }
    return null;
  }

  render() {
    let { getComponent, authSelectors, authActions } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")
    let accessToken = authSelectors.getAccessToken();

    accessToken = accessToken ? accessToken : '';

    return (
        <div className="topbar">
          <div className="wrapper">
            <div className="topbar-wrapper">
              <Link href="#" title="Swagger UX">
                <span>oeCloud.io</span>
              </Link>
              <form className="download-url-wrapper" onSubmit={this.setAccessToken.bind(this)}>
                <input className="download-url-input" placeholder="Input an access token here" type="text" onChange={ this.onTextChange.bind(this) } value={ accessToken } />
                <Button className="download-url-button">Set Token</Button>
              </form>
            </div>
          </div>
        </div>

    )
  }
}

Banner.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired
}
