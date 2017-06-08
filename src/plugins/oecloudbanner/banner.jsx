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
    if (window.localStorage) {
      let key = window.localStorage.getItem(lsKey);
      if (key) {
        this.updateToken(key)
      }
    }
  }

  setAccessToken(e) {
    console.log('set token');
    let { target } = e, form = target;
    let input = form.getElementsByTagName('input')[0];
    let token = input.value;

    this.updateToken(token.length ? token: null);
    if(e) e.preventDefault();
  }

  updateToken(token) {
    let { authActions, specSelectors, specActions } = this.props
    authActions.updateAccessToken(token)
    specActions.updateSpecWithAccessToken(token)
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
    // console.log('accessToken:', accessToken);
    return (
        <div className="topbar">
          <div className="wrapper">
            <div className="topbar-wrapper">
              <Link href="#" title="Swagger UX">
                <span>oeCloud.io API Explorer</span>
              </Link>
              <form className="set-token-wrapper" onSubmit={ this.setAccessToken.bind(this) }>
                <input className="set-token-input" type="text" defaultValue={ accessToken } />
                <Button className="set-token-button">Set Token</Button>
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
