import React, { Component, PropTypes } from 'react';
import { reduxForm, Field } from 'redux-form';

import RenderField from './RenderField';
import { required, email, passwordStrong } from './validate';
import './style.scss';

const RegisterForm = (props) => {
  const { handleSubmit, onAuthTypeChange } = props;

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
        validate={[required, passwordStrong]}
      />
      <Field
        name="confirmPassword"
        type="password"
        component={RenderField}
        label="Repeat password"
        validate={[required]}
      />
      <Field
        name="fullname"
        type="text"
        component={RenderField}
        label="Full name"
        validate={[required]}
      />
      <div className="authForm__inlineButtons">
        <button>Profile Pic</button>
        <button>Cover img</button>
      </div>
      <div className="authForm__buttons">
        <button onClick={() => { onAuthTypeChange('login'); }}>
          Login
        </button>
        <button className="active">
          Register
        </button>
      </div>
    </form>
  );
};

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
};

export default reduxForm({
  form: 'registerForm',
})(RegisterForm);

