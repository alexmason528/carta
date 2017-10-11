import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import Dropzone from 'react-dropzone'
import RenderField from './RenderField'
import RenderDropzone from './RenderDropzone'
import registerFormValidator from './validate'
import './style.scss'

const RegisterForm = props => {
  const { handleSubmit, registerError, onAuthTypeChange } = props

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
        name="firstname"
        type="text"
        component={RenderField}
        label="First name"
      />
      <Field
        name="lastname"
        type="text"
        component={RenderField}
        label="Last name"
      />
      <div className="authForm__uploadButtons">
        <Field
          className="authForm__uploadButton"
          name="profile_pic"
          label="Profile Pic"
          component={RenderDropzone}
        />
        <Field
          className="authForm__uploadButton"
          name="cover_img"
          label="Cover Img"
          component={RenderDropzone}
        />
      </div>
      <div className="authForm__buttons">
        <button type="button" onClick={() => { onAuthTypeChange('login') }}>
          Login
        </button>
        <button className="active">
          Register
        </button>
      </div>
      {registerError && <div className="authForm__error">{registerError}</div>}
    </form>
  )
}

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
  registerError: PropTypes.string,
}

export default reduxForm({
  form: 'registerForm',
  validate: registerFormValidator,
})(RegisterForm)

