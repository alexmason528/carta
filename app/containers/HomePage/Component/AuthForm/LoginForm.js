import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'

import RenderField from './RenderField'
import loginFormValidator from './validate'
import './style.scss'

const LoginForm = (props) => {
  const { handleSubmit, loginError, onAuthTypeChange } = props

  return (
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
      <div className="authForm__buttons">
        <button className="active">
          Login
        </button>
        <button type="button" onClick={() => { onAuthTypeChange('register') }}>
          Register
        </button>
      </div>
      {loginError && <div className="authForm__error">{loginError}</div>}
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
  loginError: PropTypes.string,
}

export default reduxForm({
  form: 'loginForm',
  validate: loginFormValidator,
})(LoginForm)
