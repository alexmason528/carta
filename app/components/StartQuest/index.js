import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { browserHistory } from 'react-router'
import { CLOUDINARY_COVER_URL } from 'containers/App/constants'
import { injectIntl, intlShape } from 'react-intl'
import messages from 'containers/HomePage/messages'
import './style.scss'

class StartQuest extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { imageLoaded: false }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const quest = ReactDOM.findDOMNode(this)
    const width = $(quest).width()
    $(quest).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.15}px` })
  }

  handleLoaded = (evt) => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { authenticated, intl: { formatMessage } } = this.props

    return (
      <div className={cx({ startQuest: true, startQuest__authenticated: authenticated, hidden: !imageLoaded })} onClick={() => browserHistory.push('/quest')}>
        <img className="startQuest__hoverImg" onLoad={this.handleLoaded} src={`${CLOUDINARY_COVER_URL}/quest.jpg`} role="presentation" />
        <img src={`${CLOUDINARY_COVER_URL}/quest.jpg`} role="presentation" />
        <h2 dangerouslySetInnerHTML={{ __html: formatMessage(messages.startQuest).replace(/\n/g, '<br/>') }} />
      </div>
    )
  }
}

export default injectIntl(StartQuest)
