import React, { Component, PropTypes } from 'react'
import { Alert } from 'reactstrap'

const RenderField = ({ input, label, type, order, meta: { touched, error, warning } }) => (
  <div>
    <input {...input} placeholder={label} type={type} />
    {
      touched && error &&
      <div className="error" style={{ zIndex: 100 - order || 0 }}>{error}</div>
    }
  </div>
)

RenderField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  order: PropTypes.number,
}

export default RenderField
