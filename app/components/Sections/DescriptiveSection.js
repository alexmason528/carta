import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import { withRouter, browserHistory } from 'react-router'
import cx from 'classnames'
import { findIndex } from 'lodash'
import { injectIntl, intlShape } from 'react-intl'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import messages from 'containers/QuestPage/messages'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import { getUrlStr, urlComposer } from 'utils/urlHelper'

class DescriptiveSection extends Component {
  static propTypes = {
    descriptiveSearchExpChange: PropTypes.func,
    currentDescriptives: PropTypes.object,
    info: PropTypes.object,
    params: PropTypes.object,
    descriptives: PropTypes.array,
    expanded: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = { search: '' }
  }

  componentDidMount() {
    this.handleAutoFocus()
  }

  componentDidUpdate() {
    this.handleAutoFocus()
  }

  handleAutoFocus() {
    if (window.innerWidth >= 768) {
      setTimeout(() => {
        if (this.refs.searchInput) {
          this.refs.searchInput.focus()
        }
      }, 0)
    }
  }

  handleExpand = expanded => {
    this.props.descriptiveSearchExpChange(expanded)
    if (!expanded) {
      this.setState({ search: '' })
    }
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  handleDescClick = (value, star) => {
    const { params } = this.props
    const url = urlComposer({ params: JSON.parse(JSON.stringify(params)), change: 'descriptives', value: getUrlStr(value), star })
    browserHistory.push(url)
  }

  render() {
    const { search } = this.state
    const { descriptives, expanded, intl: { formatMessage, locale }, currentDescriptives: { all, stars, includes, excludes, visibles } } = this.props
    const isDesktop = window.innerWidth >= 768

    let searchedDesc = search === '' ? descriptives : descriptives.filter(descriptive => descriptive[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--descriptive">
        <h1 className="section__title">{formatMessage(messages.knownFor)}</h1>
        <Img
          className={cx({ section__searchOpenBtn: true, invisible: expanded })}
          src={`${S3_ICON_URL}/search.png`}
          onClick={() => {
            this.handleExpand(true)
          }}
        />
        <Img
          className={cx({ section__searchCloseBtn: true, invisible: !expanded || (!all && stars.length === 0 && includes.length === 0) })}
          src={`${S3_ICON_URL}/back.png`}
          onClick={() => {
            this.handleExpand(false)
          }}
        />
        <input
          className={cx({ section__searchInput: true, invisible: !expanded })}
          value={search}
          placeholder={isDesktop ? '' : 'Search'}
          ref="searchInput"
          onChange={this.handleInputChange}
        />
        <div className="section__filteredList">
          <Button
            className={cx({
              hidden:
                (!expanded && !all) ||
                formatMessage(messages.anything)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) === -1,
            })}
            active={all}
            onClick={() => this.handleDescClick('anything', false)}
          >
            {formatMessage(messages.anything)}
          </Button>
          <div className={cx({ filtered: true, show: expanded || (!expanded && !all) })}>
            {searchedDesc.map((desc, index) => {
              const show = findIndex(visibles, desc) !== -1
              const star = findIndex(stars, desc) !== -1
              const active = star || (all ? findIndex(excludes, desc) === -1 : findIndex(includes, desc) !== -1)

              return expanded || star || show ? (
                <StarButton
                  key={index}
                  active={active}
                  star={star}
                  onMouseDown={() => this.handleDescClick(desc[DEFAULT_LOCALE], false)}
                  onStarClick={() => this.handleDescClick(desc[DEFAULT_LOCALE], true)}
                >
                  {desc[locale]}
                </StarButton>
              ) : null
            })}
          </div>
          <div className={cx({ stared: true, show: all && stars.length > 0 })}>
            <div className="notable">{formatMessage(messages.notably)}</div>
            {stars.map((desc, index) => (
              <StarButton
                key={index}
                active
                star
                onMouseDown={() => this.handleDescClick(desc[DEFAULT_LOCALE], false)}
                onStarClick={() => this.handleDescClick(desc[DEFAULT_LOCALE], true)}
              >
                {desc[locale]}
              </StarButton>
            ))}
          </div>
          <div className={cx({ excluded: true, show: all && !expanded && excludes.length > 0 && excludes.length !== descriptives.length })}>
            <div className="except">{formatMessage(messages.onlyIgnoring)}</div>
            {excludes.map((desc, index) => (
              <StarButton
                key={index}
                active={false}
                star={false}
                onMouseDown={() => this.handleDescClick(desc[DEFAULT_LOCALE], false)}
                onStarClick={() => this.handleDescClick(desc[DEFAULT_LOCALE], true)}
              >
                {desc[locale]}
              </StarButton>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default compose(withRouter, injectIntl)(DescriptiveSection)
