import React, { Component, PropTypes } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'

class LinkBar extends Component {
  static propTypes = {
    link: PropTypes.string,
    showLinkBar: PropTypes.bool,
    postShowLinkBar: PropTypes.func,
    postLinkChange: PropTypes.func,
    intl: intlShape.isRequired,
  }

  render() {
    const { link, showLinkBar, postShowLinkBar, postLinkChange, intl: { formatMessage } } = this.props

    return (
      <div
        className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })}
        onClick={evt => {
          evt.preventDefault()
        }}
      >
        <Img
          onClick={() => {
            postShowLinkBar(!showLinkBar)
          }}
          src={`${S3_ICON_URL}/link.png`}
        />
        <input
          type="text"
          value={link}
          placeholder={formatMessage(messages.linkMessage)}
          onKeyDown={evt => {
            if (evt.keyCode === 13) {
              postShowLinkBar(false)
            }
          }}
          onChange={evt => {
            postLinkChange(evt.target.value)
          }}
        />
      </div>
    )
  }
}

export default injectIntl(LinkBar)
