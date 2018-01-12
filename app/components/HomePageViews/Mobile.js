import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import messages from 'containers/HomePage/messages'
import {
  selectAuthenticated,
  selectUser,
  selectInfo,
} from 'containers/App/selectors'
import { updateUserRequest } from 'containers/App/actions'
import { selectEditingPost, selectPosts } from 'containers/HomePage/selectors'
import { CreatePostButton } from 'components/Buttons'
import Profile from 'components/Profile'
import FixedTile from 'components/FixedTile'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import { Post, PostCreate } from 'components/Post'
import { getItem } from 'utils/localStorage'
import { getFirstname } from 'utils/stringHelper'

class Mobile extends Component {
  static propTypes = {
    updateUserRequest: PropTypes.func,
    profileClick: PropTypes.func,
    profilePicClick: PropTypes.func,
    toggleCreatePostForm: PropTypes.func,
    posts: PropTypes.array,
    user: PropTypes.object,
    info: PropTypes.object,
    editingPost: PropTypes.object,
    authenticated: PropTypes.bool,
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
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      intl: { locale, formatMessage },
      profilePic,
      profileClick,
      profilePicClick,
      toggleCreatePostForm,
      updateUserRequest,
    } = this.props

    const localePosts = posts.filter(post => post.title[locale] !== '')
    const hasQuest = !!getItem('quests')
    const createPostButtonType =
      localePosts.length > 0 && localePosts[0].img ? 'image' : 'text'

    return (
      <Row className="homePage__row">
        <Col className="homePage__col">
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
            buttonText={hasQuest ? formatMessage(messages.orStartaNewOne) : ''}
            onClick={() => {
              browserHistory.push('/quest')
            }}
          />
          <FixedTile
            img="theme-square.jpg"
            link="/quest"
            title={formatMessage(messages.themeHighlight).replace(
              /\n/g,
              '<br/>'
            )}
            buttonText={formatMessage(messages.browseThemes)}
            onClick={() => {
              browserHistory.push('/themes')
            }}
          />
          <div className="P-R">
            {authenticated &&
              !showCreatePostForm &&
              user.verified &&
              !editingPost && (
                <CreatePostButton
                  type={createPostButtonType}
                  onClick={toggleCreatePostForm}
                />
              )}
            {authenticated &&
              showCreatePostForm && (
                <PostCreate onClose={toggleCreatePostForm} user={user} />
              )}
            {localePosts &&
              localePosts.map((post, key) => {
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
          </div>
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
})

const actions = {
  updateUserRequest,
}

export default compose(injectIntl, connect(selectors, actions))(Mobile)
