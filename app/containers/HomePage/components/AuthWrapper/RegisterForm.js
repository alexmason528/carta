import React, { Component, PropTypes } from 'react'
import { reduxForm, Field } from 'redux-form'
import Dropzone from 'react-dropzone'
import RenderField from 'components/RenderField'
import RenderDropzone from './RenderDropzone'
import registerFormValidator from './validate'
import './style.scss'

const RegisterForm = ({ handleSubmit, registerError, onAuthTypeChange }) => (
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
    <div className="authWrapper__uploadButtons">
      <Field
        className="authWrapper__uploadButton"
        name="profile_pic"
        label="Profile Pic"
        component={RenderDropzone}
      />
      <Field
        className="authWrapper__uploadButton"
        name="cover_img"
        label="Cover Img"
        component={RenderDropzone}
      />
    </div>
    <div className="authWrapper__buttons">
      <button type="button" onClick={() => { onAuthTypeChange('login') }}>
        Login
      </button>
      <button className="active">
        Register
      </button>
    </div>
    {registerError && <div className="error">{registerError}</div>}
  </form>
)

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
  onAuthTypeChange: PropTypes.func,
  registerError: PropTypes.string,
}

export default reduxForm({
  form: 'registerForm',
  validate: registerFormValidator,
})(RegisterForm)

