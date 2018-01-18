import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { findIndex } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import {
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
  descriptiveSearchExpChange,
} from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import {
  selectInfo,
  selectDescriptives,
  selectCurrentDescriptives,
  selectDescriptiveSearchExpanded,
} from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class DescriptiveSection extends Component {
  static propTypes = {
    descriptiveClick: PropTypes.func,
    descriptiveStarClick: PropTypes.func,
    descriptiveAnythingClick: PropTypes.func,
    descriptiveSearchExpChange: PropTypes.func,
    currentDescriptives: PropTypes.object,
    info: PropTypes.object,
    descriptives: PropTypes.array,
    expanded: PropTypes.bool,
    className: PropTypes.string,
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
    this.props.descriptiveSearchExpChange(expanded)
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
      descriptives,
      expanded,
      intl: { formatMessage, locale },
      currentDescriptives: { all, stars, includes, excludes, visibles },
      descriptiveClick,
      descriptiveStarClick,
      descriptiveAnythingClick,
    } = this.props
    const isDesktop = window.innerWidth >= 768

    let searchedDesc =
      search === ''
        ? descriptives
        : descriptives.filter(
            descriptive =>
              descriptive[locale]
                .toLowerCase()
                .indexOf(search.toLowerCase()) !== -1
          )

    return (
      <div className="section section--descriptive">
        <h1 className="section__title Tt-U Cr-D">
          {formatMessage(messages.knownFor)}
        </h1>
        <Img
          className={cx({
            section__searchOpenBtn: true,
            invisible: expanded,
            'Cr-P': true,
            'Bs-Cb': true,
            'P-A': true,
          })}
          src={`${CLOUDINARY_ICON_URL}/search.png`}
          onClick={() => {
            this.handleExpand(true)
          }}
        />
        <Img
          className={cx({
            section__searchCloseBtn: true,
            invisible:
              !expanded ||
              (!all && stars.length === 0 && includes.length === 0),
            'Cr-P': true,
            'Bs-Cb': true,
            'P-A': true,
          })}
          src={`${CLOUDINARY_ICON_URL}/back.png`}
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
              descriptiveAnythingClick()
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
            {searchedDesc.map((desc, index) => {
              const show = findIndex(visibles, desc) !== -1
              const star = findIndex(stars, desc) !== -1
              const active =
                star ||
                (all
                  ? findIndex(excludes, desc) === -1
                  : findIndex(includes, desc) !== -1)

              return expanded || star || show ? (
                <StarButton
                  key={index}
                  active={active}
                  star={star}
                  onMouseDown={() => {
                    descriptiveClick({ desc, active })
                  }}
                  onStarClick={() => {
                    descriptiveStarClick({ desc, star })
                  }}
                >
                  {' '}
                  {desc[locale]}{' '}
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
                onMouseDown={() => {
                  descriptiveClick({ desc, active: true })
                }}
                onStarClick={() => {
                  descriptiveStarClick({ desc, star: true })
                }}
              >
                {desc[locale]}
              </StarButton>
            ))}
          </div>
          <div
            className={cx({
              excluded: true,
              show:
                all &&
                !expanded &&
                excludes.length > 0 &&
                excludes.length !== descriptives.length,
            })}
          >
            <div className="except">{formatMessage(messages.onlyIgnoring)}</div>
            {excludes.map((desc, index) => (
              <StarButton
                key={index}
                active={false}
                star={false}
                onMouseDown={() => {
                  descriptiveClick({ desc, active: false })
                }}
                onStarClick={() => {
                  descriptiveStarClick({ desc, star: false })
                }}
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

const selectors = createStructuredSelector({
  info: selectInfo(),
  descriptives: selectDescriptives(),
  currentDescriptives: selectCurrentDescriptives(),
  expanded: selectDescriptiveSearchExpanded(),
})

const actions = {
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
  descriptiveSearchExpChange,
}

export default compose(injectIntl, connect(selectors, actions))(
  DescriptiveSection
)
