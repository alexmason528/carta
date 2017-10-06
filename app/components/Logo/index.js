import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { selectAuthenticated } from 'containers/App/selectors'
import { logOut } from 'containers/App/actions'
import './style.scss'

class Logo extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
    }
  }

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    })
  }

  render() {
    const { authenticated } = this.props
    const { dropdownOpen } = this.state

    const logo = authenticated ?
      (<div className="logo">
        <img className="logo__img" onClick={this.toggleDropdown} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        <Dropdown className="logo__dropdown" isOpen={dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownMenu className="logo__dropdownMenu">
            <DropdownItem className="logo__dropdownMenuItem">Quest</DropdownItem>
            <DropdownItem className="logo__dropdownMenuDivider" divider />
            <DropdownItem className="logo__dropdownMenuItem">Settings</DropdownItem>
            <DropdownItem className="logo__dropdownMenuItem">About</DropdownItem>
            <DropdownItem className="logo__dropdownMenuItem">Credits</DropdownItem>
            <DropdownItem className="logo__dropdownMenuItem" onClick={this.props.logOut}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>) :
      (
        <div className="logo">
          <img className="logo__img" onClick={() => { browserHistory.push('/') }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        </div>
      )

    return logo
  }
}

Logo.propTypes = {
  onClick: PropTypes.func,
  logOut: PropTypes.func,
  authenticated: PropTypes.bool,
}

const mapStateToProps = createStructuredSelector({
  authenticated: selectAuthenticated(),
})

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Logo)
