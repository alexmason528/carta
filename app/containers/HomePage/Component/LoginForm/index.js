import React, { Component, PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import className from 'classnames';
import RenderField from './RenderField';

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

class LoginForm extends Component {
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

  render() {
    const { handleSubmit, submitting } = this.props;
    const { authType } = this.state;
    const register = authType === 'register';

    const loginButtonClass = className({
      authTile__button: true,
      'authTile__button--active': (authType === 'login'),
    });

    const registerButtonClass = className({
      authTile__button: true,
      'authTile__button--active': (authType === 'register'),
    });

    return (
      <form className="authTile__form" onSubmit={handleSubmit}>
        <Field name="email" type="text" component={RenderField} label="Email" />
        <Field name="password" type="email" component={RenderField} label="Password" />
        {register && <Field name="confirmPassword" type="password" component={RenderField} label="Repeat password" />}
        {register && <Field name="fullname" type="text" component={RenderField} label="Full name" />}
        {register && <div className="authTile__inlineButtons">
          <button>Profile Pic</button>
          <button>Cover img</button>
        </div>}
        <div className="authTile__buttons">
          <button name="login" type="submit" className={loginButtonClass} onClick={this.authMethodChange} disabled={submitting}>
            Login
          </button>
          <button name="register" type="submit" className={registerButtonClass} onClick={this.authMethodChange} disabled={submitting}>
            Register
          </button>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  submitting: PropTypes.bool,
};

export default reduxForm({
  form: 'LoginForm',
  validate,
})(LoginForm);
