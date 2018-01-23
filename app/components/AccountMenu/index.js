import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { reduxForm, Field, Form } from 'redux-form'
import cx from 'classnames'
import { RemoveButton } from 'components/Buttons'
import RenderField from 'components/RenderField'
import { DELETE_USER_FAIL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import deleteAccountFormValidator from './validate'
import './style.scss'

class AccountMenu extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    signOut: PropTypes.func,
    deleteUserRequest: PropTypes.func,
    onClick: PropTypes.func,
    user: PropTypes.object,
    info: PropTypes.object,
    show: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { showContent: false, showForm: false }
  }

  componentWillReceiveProps(nextProps) {
    const { show } = this.props

    if (show !== nextProps.show) {
      this.setState({ showContent: false })
    }
  }

  handleSettingClick = () => {
    const { showContent } = this.state

    if (showContent) {
      this.setState({ showContent: false, showForm: false })
    } else {
      this.setState({ showContent: true })
    }
  }

  handleDeleteAccountClick = () => {
    this.setState({ showForm: true })
  }

  handleCancelClick = () => {
    this.setState({ showForm: false })
  }

  handleDeleteUser = values => {
    const { user: { _id }, deleteUserRequest } = this.props
    const payload = {
      ...values,
      id: _id,
    }
    deleteUserRequest(payload)
  }

  render() {
    const { handleSubmit, signOut, show, info: { error, status }, intl: { formatMessage } } = this.props
    const { showContent, showForm } = this.state

    return (
      <div
        className={cx({
          accountMenu: true,
          'P-R': true,
          'Cr-D': true,
          'accountMenu--hidden': !show,
        })}
        onClick={evt => evt.stopPropagation()}
      >
        <div className="accountMenu__items">
          <button type="button" onClick={signOut}>
            {formatMessage(messages.signOut)}
          </button>{' '}
          |{' '}
          <button type="button" onClick={this.handleSettingClick}>
            {formatMessage(messages.settings)}
          </button>
        </div>
        <div
          className={cx({
            accountMenu__content: true,
            'accountMenu__content--hidden': !showContent,
          })}
        >
          <RemoveButton type="user" onClick={this.handleDeleteAccountClick}>
            <span>{formatMessage(messages.deleteAccount)}</span>
          </RemoveButton>
          <Form
            className={cx({
              accountMenu__deleteForm: true,
              'accountMenu__deleteForm--hidden': !showForm,
            })}
            onSubmit={handleSubmit(this.handleDeleteUser)}
          >
            <Field name="password" type="password" component={RenderField} label={formatMessage(messages.password)} order={1} />
            <div className="accountMenu__warning Cr-T">{formatMessage(messages.deleteConfirm)}</div>
            <div className="accountMenu__deleteFormButtons">
              <button type="button" onClick={this.handleCancelClick}>
                {formatMessage(messages.cancel)}
              </button>
              <button className="active">{formatMessage(messages.confirm)}</button>
            </div>
            {status === DELETE_USER_FAIL && error && <div className="error M-8 P-0">{error}</div>}
          </Form>
        </div>
      </div>
    )
  }
}

export default injectIntl(
  reduxForm({
    form: 'deleteAccountForm',
    validate: deleteAccountFormValidator,
  })(AccountMenu)
)
