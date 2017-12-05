import React, { Component, PropTypes, Children } from 'react'
import cx from 'classnames'
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
import { selectCurrentDescriptives } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class DescriptiveSection extends Component {
  static propTypes = {
    descriptiveClick: PropTypes.func,
    descriptiveStarClick: PropTypes.func,
    descriptiveAnythingClick: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    currentDescriptives: PropTypes.object,
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
    const { currentDescriptives: { descriptives } } = nextProps

    for (let descriptive of descriptives) {
      if (descriptive.visible) { return }
    }
    this.setState({ expanded: true })
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
    this.props.descriptiveAnythingClick()
    this.props.getRecommendationRequest()
  }

  handleDescriptiveClick = c => {
    this.props.descriptiveClick(c)
    this.props.getRecommendationRequest()
  }

  handleDescriptiveStarClick = c => {
    this.props.descriptiveStarClick(c)
    this.props.getRecommendationRequest()
  }

  render() {
    const { expanded, search } = this.state
    const { className, intl: { formatMessage, locale }, currentDescriptives: { descriptives, descriptivesAll } } = this.props

    let searchedDescriptives = (search === '') ? descriptives : descriptives.filter(descriptive => (descriptive.name.toLowerCase().indexOf(search) !== -1))

    let excludedDescriptives = descriptives.filter(descriptive => !descriptive.active)
    let staredDescriptives = descriptives.filter(descriptive => descriptive.star)
    let activeDescriptives = descriptives.filter(descriptive => descriptive.active)

    const searchBtnClass = cx({
      search: true,
      invisible: expanded,
    })

    const closeBtnClass = cx({
      close: true,
      invisible: !expanded || (!descriptivesAll && staredDescriptives.length === 0 && activeDescriptives.length === 0),
    })

    const anythingBtnClass = cx({
      hidden: (!expanded && !descriptivesAll) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = cx({
      'search-input': true,
      'descriptive-search': true,
      invisible: !expanded,
    })

    const filteredClass = cx({
      filtered: true,
      show: expanded || (!expanded && !descriptivesAll),
    })

    const excludedClass = cx({
      excluded: true,
      show: descriptivesAll && !expanded && excludedDescriptives.length > 0 && excludedDescriptives.length !== descriptives.length,
    })

    const staredClass = cx({
      stared: true,
      show: descriptivesAll && staredDescriptives.length > 0,
    })

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.knownFor) }</h1>
        <Img className={searchBtnClass} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} />
        <Img className={closeBtnClass} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} />
        <input className={searchInputClass} value={search} onChange={this.handleInputChange} />
        <div className="suggestions">
          <Button className={anythingBtnClass} active={descriptivesAll} onClick={this.handleAnythingClick}>Anything</Button>
          <div className={filteredClass}>
            {
            searchedDescriptives.map((descriptive, index) => {
              const { c, star, visible } = descriptive
              return (expanded || (star || visible)) ? (
                <StarButton
                  key={index}
                  {...descriptive}
                  onMouseDown={() => { this.handleDescriptiveClick(c) }}
                  onStarClick={() => { this.handleDescriptiveStarClick(c) }}
                >
                  {descriptive[locale]}
                </StarButton>) : null
            })
            }
          </div>
          <div className={staredClass}>
            <div className="notable">{ formatMessage(messages.notably) }</div>
            {
              staredDescriptives.map((descriptive, index) => (
                <StarButton
                  key={index}
                  {...descriptive}
                  onMouseDown={() => { this.handleDescriptiveClick(descriptive.c) }}
                  onStarClick={() => { this.handleDescriptiveStarClick(descriptive.c) }}
                >
                  {descriptive[locale]}
                </StarButton>
              ))
            }
          </div>
          <div className={excludedClass}>
            <div className="except">{ formatMessage(messages.onlyIgnoring) }</div>
            {
              excludedDescriptives.map((descriptive, index) => (
                <StarButton
                  key={index}
                  {...descriptive}
                  onMouseDown={() => { this.handleDescriptiveClick(descriptive.c) }}
                  onStarClick={() => { this.handleDescriptiveStarClick(descriptive.c) }}
                >
                  {descriptive[locale]}
                </StarButton>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
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
