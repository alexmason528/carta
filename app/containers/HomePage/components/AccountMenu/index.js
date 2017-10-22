import React, { Component, PropTypes } from 'react'
import className from 'classnames'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm, Field, Form } from 'redux-form'
import { createStructuredSelector } from 'reselect'
import { RemoveButton } from 'components/Buttons'
import RenderField from 'components/RenderField'
import { logOut, deleteUserRequest } from 'containers/App/actions'
import { selectUser } from 'containers/App/selectors'
import deleteAccountFormValidator from './validate'
import './style.scss'

class AccountMenu extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    logOut: PropTypes.func,
    deleteUserRequest: PropTypes.func,
    user: PropTypes.object,
    show: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      showContent: false,
      showForm: false,
    }
  }

  handleSettingClick = () => {
    const { showContent } = this.state

    if (showContent) {
      this.setState({
        showContent: false,
        showForm: false,
      })
    } else {
      this.setState({
        showContent: true,
      })
    }
  }

  handleDeleteAccountClick = () => {
    this.setState({
      showForm: true,
    })
  }

  handleCancelClick = () => {
    this.setState({
      showForm: false,
    })
  }

  handleDeleteUser = values => {
    const { user: { _id }, deleteUserRequest } = this.props
    const params = {
      ...values,
      id: _id,
    }

    deleteUserRequest(params)
  }

  render() {
    const { handleSubmit, logOut, show } = this.props
    const { showContent, showForm } = this.state

    const menuClass = className({
      accountMenu: true,
      'accountMenu--hidden': !show,
    })

    const contentClass = className({
      accountMenu__content: true,
      'accountMenu__content--hidden': !showContent,
    })

    const formClass = className({
      accountMenu__deleteForm: true,
      'accountMenu__deleteForm--hidden': !showForm,
    })

    return (
      <div className={menuClass}>
        <div className="accountMenu__items">
          <button type="button" onClick={logOut}>Log out</button> | <button type="button" onClick={this.handleSettingClick}>Settings</button>
        </div>
        <div className={contentClass}>
          <RemoveButton className="accountMenu__deleteButton" image="delete" onClick={this.handleDeleteAccountClick} caption="Delete Account" />
          <Form className={formClass} onSubmit={handleSubmit(this.handleDeleteUser)}>
            <Field
              name="password"
              type="password"
              component={RenderField}
              label="Password"
            />
            <div className="accountMenu__deleteFormButtons">
              <button type="button" onClick={this.handleCancelClick}>Cancel</button>
              <button className="active">Confirm</button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectUser(),
})

const actions = {
  logOut,
  deleteUserRequest,
}

export default compose(
  connect(selectors, actions),
  reduxForm({
    form: 'deleteAccountForm',
    validate: deleteAccountFormValidator,
  }),
)(AccountMenu)
