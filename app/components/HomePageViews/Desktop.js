import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'reactstrap'
import Profile from 'components/Profile'
import FixedTile from 'components/FixedTile'
import AccountMenu from 'components/AccountMenu'
import AuthForm from 'components/AuthForm'
import { Post } from 'components/Post'

class Desktop extends Component {
  static propTypes = {
    posts: PropTypes.array,
  }

  render() {
    const { posts } = this.props

    const firstColPosts = posts.filter((post, index) => index % 3 === 0)
    const secondColPosts = posts.filter((post, index) => index % 3 === 1)
    const thirdColPosts = posts.filter((post, index) => index % 3 === 2)

    return (
      <Row className="homePage__row">
        <Col xs={12} sm={6} md={4} className="homePage__col">
          <Profile
            onClick={this.handleProfileClick}
            onUpdate={updateUserRequest}
            authenticated={authenticated}
            profilePic={profilePic}
            user={user}
            info={info}
          />
          {authenticated ? (
            <AccountMenu
              show={showAccountMenu}
              onClick={this.handleProfileClick}
            />
          ) : (
            <AuthForm
              show={showAuthForm}
              onProfilePicChange={this.handleProfilePic}
              profilePic={profilePic}
            />
          )}
          {firstColPosts &&
            firstColPosts.map((post, key) => {
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
        <Col xs={12} sm={6} md={4} className="homePage__col">
          <FixedTile
            img="quest.jpg"
            link="/quest"
            title={formatMessage(
              hasQuest
                ? messages.continueYourQuest
                : messages.startPersonalQuest
            ).replace(/\n/g, '<br/>')}
            buttonText={formatMessage(messages.orStartaNewOne)}
          />
          {secondColPosts &&
            secondColPosts.map((post, key) => {
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
        <Col xs={12} sm={6} md={4} className="homePage__col">
          <FixedTile
            img="theme.jpg"
            link="/quest"
            title={formatMessage(messages.themeHighlight).replace(
              /\n/g,
              '<br/>'
            )}
            buttonText={formatMessage(messages.browseThemes)}
          />
          {thirdColPosts &&
            thirdColPosts.map((post, key) => {
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

export default Desktop
