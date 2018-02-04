import React, { Component, PropTypes } from 'react'
import { compose } from 'redux'
import { browserHistory, withRouter } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import cx from 'classnames'
import { findIndex } from 'lodash'
import { DEFAULT_LOCALE } from 'containers/LanguageProvider/constants'
import messages from 'containers/QuestPage/messages'
import { Button } from 'components/Buttons'
import { S3_ICON_URL } from 'utils/globalConstants'
import { getUrlStr, urlComposer } from 'utils/urlHelper'
import Img from 'components/Img'

class TypeSection extends Component {
  static propTypes = {
    typeSearchExpChange: PropTypes.func,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    params: PropTypes.object,
    info: PropTypes.object,
    className: PropTypes.string,
    expanded: PropTypes.bool,
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
    this.props.typeSearchExpChange(expanded)
    if (!expanded) {
      this.setState({ search: '' })
    }
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  handleTypeClick = value => {
    const { params } = this.props
    const url = urlComposer({ params: JSON.parse(JSON.stringify(params)), change: 'types', value: getUrlStr(value) })
    browserHistory.push(url)
  }

  render() {
    const { search } = this.state
    const { types, expanded, intl: { formatMessage, locale }, currentTypes: { all, includes, excludes, visibles } } = this.props
    const isDesktop = window.innerWidth >= 768

    const searchedTypes = search === '' ? types : types.filter(type => type[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--type">
        <h1 className="section__title">{formatMessage(messages.showMe)}</h1>
        <Img
          className={cx({ section__searchOpenBtn: true, invisible: expanded })}
          src={`${S3_ICON_URL}/search.png`}
          onClick={() => {
            this.handleExpand(true)
          }}
        />
        <Img
          className={cx({ section__searchCloseBtn: true, invisible: !expanded || (!all && includes.length === 0) })}
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
            onClick={() => {
              this.handleTypeClick('anything')
            }}
          >
            {formatMessage(messages.anything)}
          </Button>
          <div className={cx({ filtered: true, show: expanded || (!expanded && !all) })}>
            {searchedTypes.map((type, index) => {
              const active = all ? findIndex(excludes, type) === -1 : findIndex(includes, type) !== -1
              const show = findIndex(visibles, type) !== -1
              return expanded || show ? (
                <Button
                  active={active}
                  onClick={() => {
                    this.handleTypeClick(type[DEFAULT_LOCALE])
                  }}
                  key={index}
                >
                  {type[locale]}
                </Button>
              ) : null
            })}
          </div>
          <div className={cx({ excluded: true, show: all && !expanded && excludes.length > 0 && excludes.length !== types.length })}>
            <div className="except">{formatMessage(messages.onlyIgnoring)}</div>
            {excludes.map((type, index) => (
              <Button
                key={index}
                active={false}
                onClick={() => {
                  this.handleTypeClick(type[DEFAULT_LOCALE])
                }}
              >
                {type[locale]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default compose(injectIntl, withRouter)(TypeSection)
