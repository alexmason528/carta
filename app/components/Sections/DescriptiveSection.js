import React, { Component, PropTypes } from 'react'
import cx from 'classnames'
import { findIndex } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import {
  getRecommendationRequest,
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
} from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectInfo, selectDescriptives, selectCurrentDescriptives } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class DescriptiveSection extends Component {
  static propTypes = {
    descriptiveClick: PropTypes.func,
    descriptiveStarClick: PropTypes.func,
    descriptiveAnythingClick: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    currentDescriptives: PropTypes.object,
    info: PropTypes.object,
    descriptives: PropTypes.array,
    className: PropTypes.string,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: true,
      search: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    const { currentDescriptives: { visibles } } = nextProps

    if (visibles.length === 0) {
      this.setState({ expanded: true })
    }
  }

  handleExpand = expanded => {
    this.setState(Object.assign(
      this.state,
      { expanded },
      !expanded && { search: '' }
    ))
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  handleAnythingClick = () => {
    const { descriptiveAnythingClick, getRecommendationRequest } = this.props
    descriptiveAnythingClick()
    getRecommendationRequest()
  }

  handleDescClick = (desc, active) => {
    const { descriptiveClick, getRecommendationRequest } = this.props
    descriptiveClick({ desc, active })
    getRecommendationRequest()
  }

  handleStarClick = (desc, star) => {
    const { descriptiveStarClick, getRecommendationRequest } = this.props
    descriptiveStarClick({ desc, star })
    getRecommendationRequest()
  }

  render() {
    const { expanded, search } = this.state
    const {
      descriptives,
      intl: { formatMessage, locale },
      currentDescriptives: { all, stars, includes, excludes, visibles },
    } = this.props

    let searchedDesc = (search === '') ? descriptives : descriptives.filter(descriptive => descriptive[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--descriptive">
        <h1 className="section__title">{ formatMessage(messages.knownFor) }</h1>
        <Img className={cx({ section__searchOpenBtn: true, invisible: expanded })} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} />
        <Img className={cx({ section__searchCloseBtn: true, invisible: !expanded || (!all && stars.length === 0 && includes.length === 0) })} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} />
        <input className={cx({ section__searchInput: true, invisible: !expanded })} value={search} onChange={this.handleInputChange} />
        <div className="section__filteredList">
          <Button className={cx({ hidden: (!expanded && !all) || (formatMessage(messages.anything).toLowerCase().indexOf(search.toLowerCase()) === -1) })} active={all} onClick={this.handleAnythingClick}>
            { formatMessage(messages.anything) }
          </Button>
          <div className={cx({ filtered: true, show: expanded || (!expanded && !all) })}>
            {
              searchedDesc.map((desc, index) => {
                const show = findIndex(visibles, desc) !== -1
                const star = findIndex(stars, desc) !== -1
                const active = star || (all ? findIndex(excludes, desc) === -1 : findIndex(includes, desc) !== -1)

                return (expanded || star || show) ? (
                  <StarButton key={index} active={active} star={star} onMouseDown={() => { this.handleDescClick(desc, active) }} onStarClick={() => { this.handleStarClick(desc, star) }}> {desc[locale]} </StarButton>
                ) : null
              })
            }
          </div>
          <div className={cx({ stared: true, show: all && stars.length > 0 })}>
            <div className="notable">{ formatMessage(messages.notably) }</div>
            {
              stars.map((desc, index) => (
                <StarButton key={index} active star onMouseDown={() => { this.handleDescClick(desc, true) }} onStarClick={() => { this.handleStarClick(desc, true) }}>{desc[locale]}</StarButton>
              ))
            }
          </div>
          <div className={cx({ excluded: true, show: all && !expanded && excludes.length > 0 && excludes.length !== descriptives.length })}>
            <div className="except">{ formatMessage(messages.onlyIgnoring) }</div>
            {
              excludes.map((desc, index) => (
                <StarButton key={index} active={false} star={false} onMouseDown={() => { this.handleDescClick(desc, false) }} onStarClick={() => { this.handleStarClick(desc, false) }}>{desc[locale]}</StarButton>
              ))
            }
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
})

const actions = {
  descriptiveClick,
  descriptiveStarClick,
  descriptiveAnythingClick,
  getRecommendationRequest,
}

export default compose(
  injectIntl,
  connect(selectors, actions),
)(DescriptiveSection)
