import React, { Component, PropTypes, Children } from 'react'
import cx from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { GET_QUESTINFO_SUCCESS, GET_QUESTINFO_FAIL, QUEST_ADD } from 'containers/QuestPage/constants'
import { getRecommendationRequest, typeSelect } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectInfo, selectTypes, selectCurrentTypes } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'
import Img from 'components/Img'

class TypeSection extends Component {
  static propTypes = {
    typeSelect: PropTypes.func,
    getRecommendationRequest: PropTypes.func,
    className: PropTypes.string,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    info: PropTypes.object,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      types: [],
      expanded: true,
      anything: false,
      search: '',
    }
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }

  componentWillUpdate(nextProps, nextState) {
    let closable = false

    const { types } = nextState
    const { className } = this.props

    for (let tp of types) {
      if (tp.active) {
        closable = true
        break
      }
    }

    if (className !== nextProps.className) {
      nextState.expanded = !closable
    }
  }

  initializeState = props => {
    const { info: { status }, types, currentTypes } = props

    if (status === GET_QUESTINFO_SUCCESS || status === GET_QUESTINFO_FAIL || status === QUEST_ADD) {
      this.setState({
        types: types.map(type => ({ ...type, visible: false, active: currentTypes.active.indexOf(type.c) !== -1 })),
      })
    }
  }

  handleExpand = expanded => {
    const data = Object.assign(
      this.state,
      { expanded },
      !expanded && { search: '' }
    )

    this.setState(data)
  }

  handleInputChange = evt => {
    this.setState({ search: evt.target.value })
  }

  handleAnythingClick = () => {
    const { types, anything } = this.state

    let stateData = {
      anything: !anything,
      types: types.map(type => ({ ...type, active: !anything })),
    }

    if (anything) {
      stateData.expanded = true
    }

    this.setState(stateData, this.handleGetRecommendation)
  }

  handleTypeClick = name => {
    const { types } = this.state
    this.setState({
      types: types.map(type => (type.name === name) ? { ...type, active: !type.active } : type),
    }, this.handleGetRecommendation)
  }

  handleGetRecommendation = () => {
    const { types, anything } = this.state

    let active = []
    let inactive = []

    types.forEach(type => type.active ? active.push(type.c) : inactive.push(type.c))

    let questTypes = { anything, active, inactive }

    this.props.typeSelect(questTypes)
    this.props.getRecommendationRequest()
  }

  render() {
    const { types, expanded, anything, search } = this.state
    const { className, intl: { formatMessage } } = this.props

    let searchedTypes = (search === '') ? types : types.filter(type => type.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    let excludedTypes = types.filter(type => !type.active)
    let activeTypes = types.filter(type => type.active)

    const searchBtnClass = cx({
      search: true,
      invisible: expanded,
    })

    const closeBtnClass = cx({
      close: true,
      invisible: !expanded || (!anything && activeTypes.length === 0),
    })

    const anythingBtnClass = cx({
      hidden: (!expanded && !anything) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = cx({
      'search-input': true,
      'type-search': true,
      invisible: !expanded,
    })

    const filteredClass = cx({
      filtered: true,
      show: expanded || (!expanded && !anything),
    })

    const excludedClass = cx({
      excluded: true,
      show: anything && !expanded && excludedTypes.length > 0 && excludedTypes.length !== types.length,
    })

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.showme) }</h1>
        <Img className={searchBtnClass} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} />
        <Img className={closeBtnClass} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} />
        <input className={searchInputClass} value={search} onChange={this.handleInputChange} />
        <div className="suggestion">
          <Button
            className={anythingBtnClass}
            active={anything}
            onClick={this.handleAnythingClick}
          >
            Anything
          </Button>
          <div className={filteredClass}>
            {
            searchedTypes.map((type, index) =>
              (expanded || type.active) ? <Button active={type.active} onClick={() => { this.handleTypeClick(type.name) }} key={index}>{type.name}</Button> : null
            )
            }
          </div>
          <div className={excludedClass}>
            <div className="except">{ formatMessage(messages.onlyignoring) }</div>
            { excludedTypes.map((type, index) => <Button key={index} active={type.active} onClick={() => { this.handleTypeClick(type.name) }}>{type.name}</Button>) }
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  types: selectTypes(),
  info: selectInfo(),
  currentTypes: selectCurrentTypes(),
})

const actions = {
  getRecommendationRequest,
  typeSelect,
}

export default injectIntl(connect(selectors, actions)(TypeSection))
