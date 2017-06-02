import React, { PropTypes } from "react"
import window from 'core/window'

const lsKey = "swagger_accessToken"

export default class Banner extends React.Component {

  constructor(props, context) {
    super(props, context)
    let token = this.getAccessToken();
    this.state = { access_token: token }
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({'access_token': nextProps.authSelectors.getAccessToken()})
  }
  setAccessToken(e) {
    if (window.localStorage) {
      window.localStorage.setItem(lsKey, this.state.access_token);

    }
    if(e) e.preventDefault();
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
    let { getComponent, specSelectors } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    return (
        <div className="topbar">
          <div className="wrapper">
            <div className="topbar-wrapper">
              <Link href="#" title="Swagger UX">
                <span>oeCloud.io</span>
              </Link>
              <form className="download-url-wrapper" onSubmit={this.setAccessToken.bind(this)}>
                <input className="download-url-input" type="text" onChange={ this.onTextChange.bind(this) } value={this.state.access_token } />
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
