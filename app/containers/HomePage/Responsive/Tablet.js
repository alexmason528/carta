import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { pullAt, findIndex } from 'lodash'
import messages from 'containers/HomePage/messages'
import { signOut, changeAuthMethod, deleteUserRequest, updateUserRequest, signInRequest, registerRequest } from 'containers/App/actions'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { selectViewport } from 'containers/QuestPage/selectors'
import { selectEditingPost, selectPosts } from 'containers/HomePage/selectors'
import { CreatePostButton } from 'components/Buttons'
import Profile from 'components/Profile'
import { FixedTile } from 'components/Tiles'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import { Post, PostCreate } from 'components/Post'
import { getFirstname } from 'utils/stringHelper'
import { checkQuest } from 'utils/urlHelper'

class Tablet extends Component {
  static propTypes = {
    profileClick: PropTypes.func,
    profilePicClick: PropTypes.func,
    toggleCreatePostForm: PropTypes.func,
    deleteUserRequest: PropTypes.func,
    updateUserRequest: PropTypes.func,
    signInRequest: PropTypes.func,
    signOut: PropTypes.func,
    registerRequest: PropTypes.func,
    changeAuthMethod: PropTypes.func,
    posts: PropTypes.array,
    user: PropTypes.object,
    info: PropTypes.object,
    viewport: PropTypes.object,
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
      viewport,
      editingPost,
      showAuthForm,
      showCreatePostForm,
      showAccountMenu,
      intl: { locale, formatMessage },
      profilePic,
      profileClick,
      profilePicClick,
      toggleCreatePostForm,
      deleteUserRequest,
      updateUserRequest,
      signInRequest,
      signOut,
      registerRequest,
      changeAuthMethod,
    } = this.props

    let localePosts = posts.filter(post => post.title[locale] !== '')
    let secondColPosts = localePosts.length > 0 ? pullAt(localePosts, [0]) : []
    let firstColPosts = localePosts.length > 0 ? pullAt(localePosts, findIndex(localePosts, post => !!post.img)) : []
    const { url, continueQuest } = checkQuest(viewport)
    const createPostButtonType = secondColPosts.length > 0 && secondColPosts[0].img ? 'image' : 'text'

    localePosts.map((post, index) => {
      if (index % 2 === 0) {
        firstColPosts.push(post)
      } else {
        secondColPosts.push(post)
      }
    })

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
            <AccountMenu
              show={showAccountMenu}
              user={user}
              info={info}
              signOut={signOut}
              deleteUserRequest={deleteUserRequest}
              onClick={profileClick}
            />
          ) : (
            <AuthForm
              show={showAuthForm}
              info={info}
              profilePic={profilePic}
              signInRequest={signInRequest}
              registerRequest={registerRequest}
              changeAuthMethod={changeAuthMethod}
              onProfilePicChange={profilePicClick}
            />
          )}
          <div>
            {firstColPosts &&
              firstColPosts.map((post, key) => {
                const data = {
                  ...post,
                  key: post._id,
                  firstname: getFirstname(post.author.fullname),
                  editable: authenticated && (post.author._id === user._id || user.role === 'admin') && !editingPost && !showCreatePostForm,
                  first: key === 0 && authenticated,
                }
                return <Post {...data} />
              })}
          </div>
        </Col>
        <Col className="homePage__col">
          <FixedTile
            img="wide/quest.jpg"
            link={url}
            title={formatMessage(continueQuest ? messages.continueYourQuest : messages.startPersonalQuest).replace(/\n/g, '<br/>')}
            buttonText={formatMessage(messages.browseThemes)}
            onClick={() => {
              browserHistory.push('/themes')
            }}
          />
          <div className="P-R">
            {authenticated &&
              !showCreatePostForm &&
              user.verified &&
              !editingPost && <CreatePostButton type={createPostButtonType} onClick={toggleCreatePostForm} />}
            {authenticated && showCreatePostForm && <PostCreate onClose={toggleCreatePostForm} user={user} />}
            {secondColPosts &&
              secondColPosts.map((post, key) => {
                const data = {
                  ...post,
                  key: post._id,
                  firstname: getFirstname(post.author.fullname),
                  editable: authenticated && (post.author._id === user._id || user.role === 'admin') && !editingPost && !showCreatePostForm,
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
  viewport: selectViewport(),
  posts: selectPosts(),
  editingPost: selectEditingPost(),
  authenticated: selectAuthenticated(),
  user: selectUser(),
  info: selectInfo(),
})

const actions = {
  signInRequest,
  signOut,
  registerRequest,
  deleteUserRequest,
  updateUserRequest,
  changeAuthMethod,
}

export default compose(injectIntl, connect(selectors, actions))(Tablet)