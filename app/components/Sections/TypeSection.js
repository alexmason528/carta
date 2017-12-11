import React, { Component, PropTypes, Children } from 'react'
import cx from 'classnames'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { findIndex } from 'lodash'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { UPDATE_VISIBILITY } from 'containers/QuestPage/constants'
import { getRecommendationRequest, typeClick, typeAnythingClick } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectInfo, selectTypes, selectCurrentTypes } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class TypeSection extends Component {
  static propTypes = {
    typeClick: PropTypes.func,
    typeAnythingClick: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    info: PropTypes.object,
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
    const { currentTypes: { visibles } } = nextProps

    if (visibles.length === 0) {
      this.setState({ expanded: true })
    }
  }

  handleExpand = expanded => {
    this.setState(Object.assign(
      {},
      this.state,
      { expanded },
      !expanded && { search: '' },
    ))
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  handleAnythingClick = () => {
    const { typeAnythingClick, getRecommendationRequest } = this.props
    typeAnythingClick()
    getRecommendationRequest()
  }

  handleTypeClick = (type, active) => {
    const { typeClick, getRecommendationRequest } = this.props
    typeClick({ type, active })
    getRecommendationRequest()
  }

  render() {
    const { expanded, search } = this.state
    const {
      className,
      types,
      intl: { formatMessage, locale },
      currentTypes: { all, includes, excludes, visibles },
    } = this.props

    let searchedTypes = (search === '') ? types : types.filter(type => type[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)

    return (
      <div className="section section--type">
        <h1 className="section__title">{ formatMessage(messages.showMe) }</h1>
        <Img
          className={cx({
            section__searchOpenBtn: true,
            invisible: expanded,
          })}
          src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }}
        />
        <Img
          className={cx({ section__searchCloseBtn: true, invisible: !expanded || (!all && includes.length === 0) })}
          src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }}
        />
        <input className={cx({ section__searchInput: true, invisible: !expanded })} value={search} onChange={this.handleInputChange} />
        <div className="section__filteredList">
          <Button
            className={cx({ hidden: (!expanded && !all) || (formatMessage(messages.anything).toLowerCase().indexOf(search.toLowerCase()) === -1) })}
            active={all}
            onClick={this.handleAnythingClick}
          >
            { formatMessage(messages.anything) }
          </Button>
          <div className={cx({ filtered: true, show: expanded || (!expanded && !all) })}>
            {
              searchedTypes.map((type, index) => {
                const active = all ? findIndex(excludes, type) === -1 : findIndex(includes, type) !== -1
                const show = findIndex(visibles, type) !== -1
                return (expanded || show) ? <Button active={active} onClick={() => { this.handleTypeClick(type, active) }} key={index}>{type[locale]}</Button> : null
              })
            }
          </div>
          <div
            className={cx({
              excluded: true,
              show: all && !expanded && excludes.length > 0 && excludes.length !== types.length,
            })}
          >
            <div className="except">{ formatMessage(messages.onlyIgnoring) }</div>
            { excludes.map((type, index) => <Button key={index} active={false} onClick={() => { this.handleTypeClick(type, false) }}>{type[locale]}</Button>) }
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectInfo(),
  types: selectTypes(),
  currentTypes: selectCurrentTypes(),
})

const actions = {
  getRecommendationRequest,
  typeClick,
  typeAnythingClick,
}

export default compose(
  connect(selectors, actions),
  injectIntl,
)(TypeSection)
