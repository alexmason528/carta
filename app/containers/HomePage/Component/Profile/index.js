import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './style.scss';

class Profile extends Component {

  componentDidMount() {
    const interval =
    setInterval(() => {
      const profile = ReactDOM.findDOMNode(this);
      if ($(profile).height() > 0) {
        clearInterval(interval);
        this.handleResize();
      }
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const profile = ReactDOM.findDOMNode(this);
    const profilePic = $(profile).find('.profile__pic');
  }

  render() {
    return (
      <div className="profile" onClick={this.props.onClick}>
        <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/wide/0025.jpg" role="presentation" />
        <div className="profile__pic">
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784213/image/profile/bag/6.jpg" role="presentation" />
        </div>
        <h2>Sign in</h2>
      </div>
    );
  }
}

Profile.propTypes = {
  onClick: PropTypes.func,
};

export default Profile;
