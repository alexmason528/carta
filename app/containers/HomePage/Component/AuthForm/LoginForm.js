import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

import RenderField from './RenderField';
import { required, email, passwordStrong } from './validate';
import './style.scss';

const LoginForm = (props) => {
  const { handleSubmit, error, fetching, onAuthTypeChange } = props;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        name="email"
        type="email"
        component={RenderField}
        label="Email"
        validate={[required, email]}
      />
      <Field
        name="password"
        type="password"
        component={RenderField}
        label="Password"
        validate={[required]}
      />
      <div className="authForm__buttons">
        <button className="active">
          Login
        </button>
        <button onClick={() => { onAuthTypeChange('register'); }}>
          Register
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
  error: PropTypes.string,
  fetching: PropTypes.bool,
};

export default reduxForm({
  form: 'loginForm',
})(LoginForm);
