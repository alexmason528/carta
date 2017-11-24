import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import messages from 'containers/HomePage/messages'
import Img from 'components/Img'

class LinkBar extends Component { // eslint-disable-line react/prefer-stateless-function
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
      <div className={cx({ postLinkBar: true, 'postLinkBar--hidden': !showLinkBar })} onClick={evt => { evt.stopPropagation() }}>
        <Img onClick={evt => { evt.stopPropagation(); postShowLinkBar(!showLinkBar) }} src={`${CLOUDINARY_ICON_URL}/link.png`} />
        <input
          type="text"
          value={link}
          placeholder={formatMessage(messages.linkMessage)}
          onKeyDown={evt => { if (evt.keyCode === 13) { postShowLinkBar(false) } }}
          onChange={evt => {
            evt.stopPropagation()
            postLinkChange(evt.target.value)
          }}
        />
      </div>
    )
  }
}

export default injectIntl(LinkBar)
