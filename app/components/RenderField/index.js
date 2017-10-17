import React, { Component, PropTypes } from 'react'
import { Alert } from 'reactstrap'

const RenderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {
      touched && error &&
      <div className="error">{error}</div>
    }
  </div>
)

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
}

export default RenderField