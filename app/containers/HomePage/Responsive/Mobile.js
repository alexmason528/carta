import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'reactstrap'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { injectIntl, intlShape } from 'react-intl'
import { browserHistory } from 'react-router'
import { signOut, changeAuthMethod, deleteUserRequest, updateUserRequest, signInRequest, registerRequest } from 'containers/App/actions'
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
import { getItem } from 'utils/localStorage'
import { getFirstname } from 'utils/stringHelper'
import { checkQuest } from 'utils/urlHelper'

class Mobile extends Component {
  static propTypes = {
    profileClick: PropTypes.func,
    profilePicClick: PropTypes.func,
    toggleCreatePostForm: PropTypes.func,
    deleteUserRequest: PropTypes.func,
    updateUserRequest: PropTypes.func,
    registerRequest: PropTypes.func,
    signInRequest: PropTypes.func,
    signOut: PropTypes.func,
    questAdd: PropTypes.func,
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
      questAdd,
    } = this.props

    const localePosts = posts.filter(post => post.title[locale] !== '')
    const hasQuest = !!getItem('quests')
    const createPostButtonType = localePosts.length > 0 && localePosts[0].img ? 'image' : 'text'
    const { url, continueQuest } = checkQuest(viewport)

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
          <FixedTile
            img="square/quest.jpg"
            link={url}
            title={formatMessage(continueQuest ? messages.continueYourQuest : messages.startPersonalQuest).replace(/\n/g, '<br/>')}
            buttonText={hasQuest ? formatMessage(messages.orStartaNewOne) : ''}
            onClick={() => {
              questAdd()
              browserHistory.push('/quest')
            }}
          />
          <FixedTile
            img="square/brabant.jpg"
            link="/quest/5.5778,51.4161,8.4/regions/walking,relaxing,picnics,cycling"
            title={formatMessage(messages.brabantOutdoors).replace(/\n/g, '<br/>')}
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
            {localePosts &&
              localePosts.map((post, key) => {
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
  signInRequest,
  signOut,
  registerRequest,
  deleteUserRequest,
  updateUserRequest,
  changeAuthMethod,
}

export default compose(injectIntl, connect(selectors, actions))(Mobile)
