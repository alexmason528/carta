import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loginRequest } from '../../actions';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { makeSelectLogin, makeSelectRegister, makeSelectUser } from '../../selectors';
import './style.scss';

class AuthForm extends Component {
  constructor() {
    super();
    this.state = {
      authType: 'login',
    };
  }

  handleLoginSubmit = (values) => {
    this.props.loginRequest(values.toJS());
  }

  handleRegisterSubmit = (values) => {
  }

  handleAuthTypeChange = (authType) => {
    this.setState({
      authType,
    });
  }

  render() {
    const { authType } = this.state;
    const { login, register, user } = this.props;

    return (
      <div className={this.props.className}>
        <button className="authForm__closeBtn" onClick={this.props.onClose}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/icon/close.png" role="presentation" /></button>
        <div className="authForm__divider">
          <span>With</span>
        </div>
        <div className="authForm__inlineButtons">
          <button onClick={this.googleLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/google.png" role="presentation" /><span>Google</span></button>
          <button onClick={this.facebookLogin}><img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784819/image/icon/logo/facebook.png" role="presentation" /><span>Facebook</span></button>
        </div>
        <div className="authForm__divider">
          <span>Or</span>
        </div>
        { authType === 'login' && <LoginForm onSubmit={this.handleLoginSubmit} onAuthTypeChange={this.handleAuthTypeChange} {...login} /> }
        { authType === 'register' && <RegisterForm onSubmit={this.handleLoginSubmit} onAuthTypeChange={this.handleAuthTypeChange} {...register} /> }
      </div>
    );
  }
}

AuthForm.propTypes = {
  loginRequest: PropTypes.func,
  onClose: PropTypes.func,
  login: PropTypes.object,
  register: PropTypes.object,
  user: PropTypes.object,
  className: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    loginRequest: (payload) => dispatch(loginRequest(payload)),
  };
}

const mapStateToProps = createStructuredSelector({
  login: makeSelectLogin(),
  register: makeSelectRegister(),
  user: makeSelectUser(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
