import React, { PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'

const RenderField = ({
  input,
  label,
  type,
  order,
  meta: { touched, error },
  intl: { formatMessage },
}) => {
  return (
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        error && (
          <div className="error" style={{ zIndex: 50 - order || 0 }}>
            {formatMessage({ id: error })}
          </div>
        )}
    </div>
  )
}

RenderField.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  label: PropTypes.string,
  type: PropTypes.string,
  order: PropTypes.number,
  intl: intlShape.isRequired,
}

export default injectIntl(RenderField)
