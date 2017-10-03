/*
 * HomePage
 *
 */

import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import className from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';
import { Container, Row, Col } from 'reactstrap';

import { ImagePost, TextPost, NormalPost } from './Component/Posts';
import { makeSelectPosts, makeSelectSuggestions } from './selectors';
import { fetchCommunityInfo } from './actions';

import Suggestion from './Component/Suggestion';
import Quest from './Component/Quest';
import Profile from './Component/Profile';
import AuthForm from './Component/AuthForm';
import AddPostButton from './Component/AddPostButton';

import './style.scss';

const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.state = {
      showAuthForm: false,
      showAddForm: false,
      authType: 'login',
      userInfo: {
        email: '',
        password: '',
        confirmPassword: '',
        fullname: '',
      },
    };
  }

  componentWillMount() {
    this.props.fetchCommunityInfo();
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
  }

  googleLogin = () => {
  }

  facebookLogin = () => {
  }

  closeAuthForm = () => {
    this.setState({
      showAuthForm: false,
    });
  }

  toggleAuthForm = () => {
    this.setState({
      showAuthForm: !this.state.showAuthForm,
    });
  }

  showAddForm = () => {
    this.setState({
      showAddForm: true,
    });
  }

  render() {
    const { authType, showAuthForm, userInfo } = this.state;
    const { posts, suggestions } = this.props;

    const register = authType === 'register';
    const error = 'Wrong password';

    const authFormClass = className({
      authForm: true,
      'authForm--hidden': !showAuthForm,
    });

    const today = new Date();
    const todayStr = today.toJSON().slice(0, 10);

    const yesterday = new Date(today.setDate(today.getDate() - 1));
    const yesterdayStr = yesterday.toJSON().slice(0, 10);

    return (
      <Container fluid className="homepage">
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <img className="logo" onClick={() => { browserHistory.push('/'); }} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/logo-100.png" role="presentation" />
        <div className="logo-name-tab">
          <img src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506785283/image/content/name-vertical.png" role="presentation" />
        </div>
        <Row className="homepage__row">
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col">
            <Profile onClick={this.toggleAuthForm} />
            <AuthForm className={authFormClass} onClose={this.closeAuthForm} />
            <Quest />
          </Col>

          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-sm-down">
            <AddPostButton />
            {
              posts.map((post, index) => {
                let component;
                const { title, created_at, content, img, author } = post.toJS();
                const username = `${author[0].firstname} ${author[0].lastname}`;

                const date = created_at.slice(0, 10);
                const time = created_at.slice(11);

                const month = Months[parseInt(date.slice(5, 7), 10) - 1];
                let day = parseInt(date.slice(8, 10), 10);

                if (day === 1) {
                  day = '1st';
                } else if (day === 2) {
                  day = '2nd';
                } else if (day === 3) {
                  day = '3rd';
                } else {
                  day = `${day}th`;
                }

                let dateStr;

                if (date === yesterdayStr) {
                  dateStr = 'yesterday ';
                } else if (date === todayStr) {
                  dateStr = '';
                } else if (date.slice(0, 4) === todayStr.slice(0, 4)) {
                  dateStr = `${month} ${day}`;
                } else {
                  dateStr = `${month} ${day}, ${date.slice(0, 4)}`;
                }

                dateStr += ` ${time}`;


                if (content && img) {
                  component = <NormalPost key={index} imageUrl={img} title={title} username={username} date={dateStr} content={content} />;
                } else if (content && !img) {
                  component = <TextPost key={index} title={title} username={username} date={dateStr} content={content} />;
                } else if (!content && img) {
                  component = <ImagePost key={index} imageUrl={img} title={title} username={username} date={dateStr} />;
                }

                return component;
              })
            }
          </Col>
          <Col lg={4} md={6} sm={12} xs={12} className="homepage__col hidden-md-down">
            {
              suggestions.map((suggestion, index) => <Suggestion key={index} imageUrl={suggestion.get('img')} title={suggestion.get('title')} />)
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

HomePage.propTypes = {
  fetchCommunityInfo: PropTypes.func,
  posts: PropTypes.object,
  suggestions: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  posts: makeSelectPosts(),
  suggestions: makeSelectSuggestions(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchCommunityInfo: () => dispatch(fetchCommunityInfo()),
  };
}
// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
