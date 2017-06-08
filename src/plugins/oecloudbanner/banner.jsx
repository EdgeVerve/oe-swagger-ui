import React, { PropTypes } from "react"
import window from 'core/window'

const lsKey = "swagger_accessToken"

export default class Banner extends React.Component {

  constructor(props, context) {
    super(props, context)
    // let token = this.getAccessToken();
    this.state = { access_token: null }
    this.handleChange = this.onChange.bind(this);
    this.handleSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    let key = null;
    if (window.localStorage) {
      key = window.localStorage.getItem(lsKey);
      if (key) {
        this.updateToken(key)
      }
    }
    this.setState({ access_token: key });
  }

  onChange(e) {
    this.setState({ access_token: e.target.value });
  }

  onSubmit(e) {
    let token = this.state.access_token;
    this.updateToken(token.length ? token: null);
    this.setState({ access_token: token })
    e.preventDefault();
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
    let accessToken = this.state.access_token ? this.state.access_token : '';
    //
    // accessToken = accessToken ? accessToken : '';
    // console.log('accessToken:', accessToken);
    return (
        <div className="topbar">
          <div className="wrapper">
            <div className="topbar-wrapper">
              <Link href="#" title="Swagger UX">
                <span>oeCloud.io API Explorer</span>
              </Link>
              <form className="set-token-wrapper" onSubmit={ this.handleSubmit }>
                <input className="set-token-input" type="text" value={ accessToken } onChange={ this.handleChange } />
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
