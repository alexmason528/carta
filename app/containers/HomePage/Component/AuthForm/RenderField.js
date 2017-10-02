import React, { Component, PropTypes } from 'react';

const RenderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
}) =>
  <div>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error &&
          <span>
            {error}
          </span>) ||
          (warning &&
            <span>
              {warning}
            </span>))}
    </div>
  </div>;

RenderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

export default RenderField;
