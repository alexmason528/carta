import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'

import RenderField from './RenderField'
import registerFormValidator from './validate'
import './style.scss'

const RegisterForm = props => {
  const { handleSubmit, onAuthTypeChange } = props

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
      <Field
        name="confirmPassword"
        type="password"
        component={RenderField}
        label="Repeat password"
      />
      <Field
        name="fullname"
        type="text"
        component={RenderField}
        label="Full name"
      />
      <div className="authForm__inlineButtons">
        <button>Profile Pic</button>
        <button>Cover img</button>
      </div>
      <div className="authForm__buttons">
        <button type="button" onClick={() => { onAuthTypeChange('login') }}>
          Login
        </button>
        <button className="active">
          Register
        </button>
      </div>
    </form>
  )
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
}

export default reduxForm({
  form: 'registerForm',
  validate: registerFormValidator,
})(RegisterForm)

