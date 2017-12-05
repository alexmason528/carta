import React, { Component, PropTypes, Children } from 'react'
import cx from 'classnames'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { GET_QUESTINFO_SUCCESS, GET_QUESTINFO_FAIL, QUEST_ADD } from 'containers/QuestPage/constants'
import { getRecommendationRequest, typeClick, typeAnythingClick } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectInfo, selectCurrentTypes } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class TypeSection extends Component {
  static propTypes = {
    typeClick: PropTypes.func,
    typeAnythingClick: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
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
    const { currentTypes: { types } } = nextProps

    for (let type of types) {
      if (type.visible) { return }
    }
    this.setState({ expanded: true })
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
    this.props.typeAnythingClick()
    this.props.getRecommendationRequest()
  }

  handleTypeClick = c => {
    this.props.typeClick(c)
    this.props.getRecommendationRequest()
  }

  render() {
    const { expanded, search } = this.state
    const { className, intl: { formatMessage, locale }, currentTypes: { types, typesAll } } = this.props

    let searchedTypes = (search === '') ? types : types.filter(type => type[locale].toLowerCase().indexOf(search.toLowerCase()) !== -1)
    let excludedTypes = types.filter(type => !type.active)
    let activeTypes = types.filter(type => type.active)

    const searchBtnClass = cx({
      search: true,
      invisible: expanded,
    })

    const closeBtnClass = cx({
      close: true,
      invisible: !expanded || (!typesAll && activeTypes.length === 0),
    })

    const anythingBtnClass = cx({
      hidden: (!expanded && !typesAll) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = cx({
      'search-input': true,
      'type-search': true,
      invisible: !expanded,
    })

    const filteredClass = cx({
      filtered: true,
      show: expanded || (!expanded && !typesAll),
    })

    const excludedClass = cx({
      excluded: true,
      show: typesAll && !expanded && excludedTypes.length > 0 && excludedTypes.length !== types.length,
    })

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.showMe) }</h1>
        <Img className={searchBtnClass} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} />
        <Img className={closeBtnClass} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} />
        <input className={searchInputClass} value={search} onChange={this.handleInputChange} />
        <div className="suggestion">
          <Button
            className={anythingBtnClass}
            active={typesAll}
            onClick={this.handleAnythingClick}
          >
            Anything
          </Button>
          <div className={filteredClass}>
            {
            searchedTypes.map((type, index) =>
              (expanded || type.visible) ? <Button active={type.active} onClick={() => { this.handleTypeClick(type.c) }} key={index}>{type[locale]}</Button> : null)
            }
          </div>
          <div className={excludedClass}>
            <div className="except">{ formatMessage(messages.onlyIgnoring) }</div>
            { excludedTypes.map((type, index) => <Button key={index} active={type.active} onClick={() => { this.handleTypeClick(type.c) }}>{type[locale]}</Button>) }
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  info: selectInfo(),
  currentTypes: selectCurrentTypes(),
})

const actions = {
  getRecommendationRequest,
  typeClick,
  typeAnythingClick,
}

export default compose(
  injectIntl,
  connect(selectors, actions),
)(TypeSection)
