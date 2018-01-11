import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { injectIntl, intlShape } from 'react-intl'
import Profile from 'components/Profile'
import FixedTile from 'components/FixedTile'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import { Post } from 'components/Post'
import messages from 'containers/HomePage/messages'
import {
  selectAuthenticated,
  selectUser,
  selectInfo,
} from 'containers/App/selectors'
import { updateUserRequest } from 'containers/App/actions'
import {
  selectHasQuest,
  selectEditingPost,
  selectPosts,
} from 'containers/HomePage/selectors'
import { getFirstname } from 'utils/stringHelper'

class Mobile extends Component {
  static propTypes = {
    updateUserRequest: PropTypes.func,
    profileClick: PropTypes.func,
    profilePicClick: PropTypes.func,
    posts: PropTypes.array,
    user: PropTypes.object,
    info: PropTypes.object,
    editingPost: PropTypes.object,
    authenticated: PropTypes.bool,
    hasQuest: PropTypes.bool,
    showAuthForm: PropTypes.bool,
    showCreatePostForm: PropTypes.bool,
    showAccountMenu: PropTypes.bool,
    profilePic: PropTypes.string,
    intl: intlShape.isRequired,
  }

  render() {
    const {
      posts,
      authenticated,
      user,
      info,
      editingPost,
      hasQuest,
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      intl: { formatMessage },
      profilePic,
      profileClick,
      profilePicClick,
      updateUserRequest,
    } = this.props

    return (
      <Row className="homePage__row">
        <Col xs={12} className="homePage__col">
          <Profile
            onClick={profileClick}
            onUpdate={updateUserRequest}
            authenticated={authenticated}
            profilePic={profilePic}
            user={user}
            info={info}
          />
          {authenticated ? (
            <AccountMenu show={showAccountMenu} onClick={profileClick} />
          ) : (
            <AuthForm
              show={showAuthForm}
              onProfilePicChange={profilePicClick}
              profilePic={profilePic}
            />
          )}
          <FixedTile
            img="quest-square.jpg"
            link="/quest"
            title={formatMessage(
              hasQuest
                ? messages.continueYourQuest
                : messages.startPersonalQuest
            ).replace(/\n/g, '<br/>')}
            buttonText={formatMessage(messages.orStartaNewOne)}
          />
          <FixedTile
            img="theme-square.jpg"
            link="/quest"
            title={formatMessage(messages.themeHighlight).replace(
              /\n/g,
              '<br/>'
            )}
            buttonText={formatMessage(messages.browseThemes)}
          />
          {posts &&
            posts.map((post, key) => {
              const data = {
                ...post,
                key: post._id,
                firstname: getFirstname(post.author.fullname),
                editable:
                  authenticated &&
                  (post.author._id === user._id || user.role === 'admin') &&
                  !editingPost &&
                  !showCreatePostForm,
                first: key === 0 && authenticated,
              }
              return <Post {...data} />
            })}
        </Col>
      </Row>
    )
  }
}

const selectors = createStructuredSelector({
  posts: selectPosts(),
  editingPost: selectEditingPost(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
  info: selectInfo(),
  hasQuest: selectHasQuest(),
})

const actions = {
  updateUserRequest,
}

export default compose(injectIntl, connect(selectors, actions))(Mobile)
