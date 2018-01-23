import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { injectIntl, intlShape } from 'react-intl'
import { findIndex } from 'lodash'
import messages from 'containers/QuestPage/messages'
import { Button } from 'components/Buttons'
import { S3_ICON_URL } from 'utils/globalConstants'
import Img from 'components/Img'

class TypeSection extends Component {
  static propTypes = {
    typeClick: PropTypes.func,
    typeAnythingClick: PropTypes.func,
    typeSearchExpChange: PropTypes.func,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    info: PropTypes.object,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      search: '',
    }
  }

  componentDidMount() {
    this.handleAutoFocus()
  }

  componentDidUpdate() {
    this.handleAutoFocus()
  }

  handleAutoFocus() {
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        if (this.searchInput) {
          ReactDOM.findDOMNode(this.searchInput).focus()
        }
        clearTimeout(timer)
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

  render() {
    const { search } = this.state
    const {
      types,
      expanded,
      intl: { formatMessage, locale },
      currentTypes: { all, includes, excludes, visibles },
      typeClick,
      typeAnythingClick,
    } = this.props
    const isDesktop = window.innerWidth >= 768

    const searchedTypes = search === '' ? types : types.filter(type => type[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--type">
        <h1 className="section__title Tt-U Cr-D">{formatMessage(messages.showMe)}</h1>
        <Img
          className={cx({
            section__searchOpenBtn: true,
            invisible: expanded,
            'Cr-P': true,
            'Bs-Cb': true,
            'P-A': true,
          })}
          src={`${S3_ICON_URL}/search.png`}
          onClick={() => {
            this.handleExpand(true)
          }}
        />
        <Img
          className={cx({
            section__searchCloseBtn: true,
            invisible: !expanded || (!all && includes.length === 0),
            'Cr-P': true,
            'Bs-Cb': true,
            'P-A': true,
          })}
          src={`${S3_ICON_URL}/back.png`}
          onClick={() => {
            this.handleExpand(false)
          }}
        />
        <input
          className={cx({ section__searchInput: true, invisible: !expanded })}
          value={search}
          placeholder={isDesktop ? '' : 'Search'}
          ref={ref => (this.searchInput = ref)}
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
              typeAnythingClick()
            }}
          >
            {formatMessage(messages.anything)}
          </Button>
          <div
            className={cx({
              filtered: true,
              show: expanded || (!expanded && !all),
            })}
          >
            {searchedTypes.map((type, index) => {
              const active = all ? findIndex(excludes, type) === -1 : findIndex(includes, type) !== -1
              const show = findIndex(visibles, type) !== -1
              return expanded || show ? (
                <Button
                  active={active}
                  onClick={() => {
                    typeClick({ type, active })
                  }}
                  key={index}
                >
                  {type[locale]}
                </Button>
              ) : null
            })}
          </div>
          <div
            className={cx({
              excluded: true,
              show: all && !expanded && excludes.length > 0 && excludes.length !== types.length,
            })}
          >
            <div className="except">{formatMessage(messages.onlyIgnoring)}</div>
            {excludes.map((type, index) => (
              <Button
                key={index}
                active={false}
                onClick={() => {
                  typeClick({ type, active: false })
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

export default injectIntl(TypeSection)
