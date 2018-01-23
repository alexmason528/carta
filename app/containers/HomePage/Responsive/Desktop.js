import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { compose } from 'redux'
import { Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { pullAt, findIndex } from 'lodash'
import { signOutUser, changeAuthMethod, deleteUserRequest, updateUserRequest, signInUserRequest, registerUserRequest } from 'containers/App/actions'
import { selectAuthenticated, selectUser, selectInfo } from 'containers/App/selectors'
import { questAdd } from 'containers/QuestPage/actions'
import { selectViewport } from 'containers/QuestPage/selectors'
import { selectEditingPost, selectPosts } from 'containers/HomePage/selectors'
import messages from 'containers/HomePage/messages'
import { CreatePostButton } from 'components/Buttons'
import Profile from 'components/Profile'
import { FixedTile } from 'components/Tiles'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import { Post, PostCreate } from 'components/Post'
import { getFirstname } from 'utils/stringHelper'
import { checkQuest } from 'utils/urlHelper'

class Desktop extends Component {
  static propTypes = {
    profileClick: PropTypes.func,
    profilePicClick: PropTypes.func,
    toggleCreatePostForm: PropTypes.func,
    registerUserRequest: PropTypes.func,
    deleteUserRequest: PropTypes.func,
    updateUserRequest: PropTypes.func,
    signInUserRequest: PropTypes.func,
    signOutUser: PropTypes.func,
    changeAuthMethod: PropTypes.func,
    questAdd: PropTypes.func,
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
      authenticated,
      posts,
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
      signInUserRequest,
      signOutUser,
      registerUserRequest,
      changeAuthMethod,
      questAdd,
    } = this.props

    let localePosts = posts.filter(post => post.title[locale] !== '')
    let secondColPosts = localePosts.length > 0 ? pullAt(localePosts, [0]) : []
    let firstColPosts = localePosts.length > 0 ? pullAt(localePosts, findIndex(localePosts, post => !!post.img)) : []
    let thirdColPosts = []
    const { url, continueQuest } = checkQuest(viewport)
    const createPostButtonType = secondColPosts.length > 0 && secondColPosts[0].img ? 'image' : 'text'

    localePosts.map((post, index) => {
      if (index % 3 === 0) {
        firstColPosts.push(post)
      } else if (index % 3 === 1) {
        secondColPosts.push(post)
      } else {
        thirdColPosts.push(post)
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
              signOutUser={signOutUser}
              deleteUserRequest={deleteUserRequest}
              onClick={profileClick}
            />
          ) : (
            <AuthForm
              show={showAuthForm}
              info={info}
              profilePic={profilePic}
              signInUserRequest={signInUserRequest}
              registerUserRequest={registerUserRequest}
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
            buttonText={continueQuest ? formatMessage(messages.orStartaNewOne) : ''}
            onClick={() => {
              questAdd()
              browserHistory.push('/quest')
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
        <Col xs={12} sm={6} md={4} className="homePage__col">
          <FixedTile
            img="wide/brabant.jpg"
            link="/quest/5.5778,51.4161,8.4/regions/walking,relaxing,picnics,cycling"
            title={formatMessage(messages.brabantOutdoors).replace(/\n/g, '<br/>')}
            buttonText={formatMessage(messages.browseThemes)}
            onClick={() => {
              browserHistory.push('/themes')
            }}
          />
          <div>
            {thirdColPosts &&
              thirdColPosts.map((post, key) => {
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
  questAdd,
  signOutUser,
  changeAuthMethod,
  signInUserRequest,
  registerUserRequest,
  deleteUserRequest,
  updateUserRequest,
}

export default compose(injectIntl, connect(selectors, actions))(Desktop)
