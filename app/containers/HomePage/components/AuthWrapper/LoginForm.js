import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import RenderField from 'components/RenderField'
import loginFormValidator from './validate'
import './style.scss'

const LoginForm = ({ handleSubmit, loginError, onAuthTypeChange }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="email"
      type="email"
      component={RenderField}
      label="Email"
    />
    <Field
      name="password"
      type="password"
      component={RenderField}
      label="Password"
    />
    <div className="authWrapper__buttons">
      <button className="active">Sign in</button>
      <button className="inactive" type="button" onClick={() => { onAuthTypeChange('register') }}>Register</button>
    </div>
    {loginError && <div className="error">{loginError}</div>}
  </form>
)

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
  loginError: PropTypes.string,
}

export default reduxForm({
  form: 'loginForm',
  validate: loginFormValidator,
})(LoginForm)
