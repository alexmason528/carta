import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import className from 'classnames';
import RenderField from './RenderField';

import './style.scss';

const validate = (values) => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.age) {
    errors.age = 'Required';
  } else if (isNaN(Number(values.age))) {
    errors.age = 'Must be a number';
  } else if (Number(values.age) < 18) {
    errors.age = 'Sorry, you must be at least 18 years old';
  }
  return errors;
};

class AuthForm extends Component {
  constructor() {
    super();
    this.state = {
      authType: 'login',
    };
  }

  authMethodChange = (evt) => {
    this.setState({
      authType: evt.target.name,
    });
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    const { authType } = this.state;
    const register = authType === 'register';

    const loginButtonClass = className({
      authForm__button: true,
      'authForm__button--active': (authType === 'login'),
    });

    const registerButtonClass = className({
      authForm__button: true,
      'authForm__button--active': (authType === 'register'),
    });

    return (
      <form className={this.props.className} onSubmit={this.handleSubmit}>
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
        <Field name="email" type="text" component={RenderField} label="Email" />
        <Field name="password" type="email" component={RenderField} label="Password" />
        {register && <Field name="confirmPassword" type="password" component={RenderField} label="Repeat password" />}
        {register && <Field name="fullname" type="text" component={RenderField} label="Full name" />}
        {register && <div className="authForm__inlineButtons">
          <button>Profile Pic</button>
          <button>Cover img</button>
        </div>}
        <div className="authForm__buttons">
          <button name="login" className={loginButtonClass} onClick={this.authMethodChange} disabled={submitting}>
            Login
          </button>
          <button name="register" className={registerButtonClass} onClick={this.authMethodChange} disabled={submitting}>
            Register
          </button>
        </div>
      </form>
    );
  }
}

AuthForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default reduxForm({
  form: 'AuthForm',
  validate,
})(AuthForm);
