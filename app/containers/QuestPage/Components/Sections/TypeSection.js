import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { FETCH_QUESTINFO_SUCCESS, FETCH_QUESTINFO_FAIL, QUEST_ADD } from 'containers/QuestPage/constants'
import { fetchRecommendations, typeSelect } from 'containers/QuestPage/actions'
import { selectInfo, selectTypes, selectCurrentTypes } from 'containers/QuestPage/selectors'
import { Button, StarButton } from '../Buttons'

class TypeSection extends Component {
  static propTypes = {
    typeSelect: PropTypes.func,
    fetchRecommendations: PropTypes.func,
    className: PropTypes.string,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    info: PropTypes.object,
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

    if (status === FETCH_QUESTINFO_SUCCESS || status === FETCH_QUESTINFO_FAIL || status === QUEST_ADD) {
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

    this.setState(stateData, this.handleFetchRecommendations)
  }

  handleTypeClick = name => {
    const { types } = this.state
    this.setState({
      types: types.map(type => (type.name === name) ? { ...type, active: !type.active } : type),
    }, this.handleFetchRecommendations)
  }

  handleFetchRecommendations = () => {
    const { typeSelect, fetchRecommendations } = this.props
    const { types, anything } = this.state

    let active = []
    let inactive = []

    types.forEach(type => type.active ? active.push(type.c) : inactive.push(type.c))

    let questTypes = { anything, active, inactive }

    typeSelect(questTypes)
    fetchRecommendations()
  }

  render() {
    const { types, expanded, anything, search } = this.state
    const { className } = this.props

    let searchedTypes = (search === '') ? types : types.filter(type => type.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    let excludedTypes = types.filter(type => !type.active)
    let activeTypes = types.filter(type => type.active)

    const searchBtnClass = classNames({
      search: true,
      invisible: expanded,
    })

    const closeBtnClass = classNames({
      close: true,
      invisible: !expanded || (!anything && activeTypes.length === 0),
    })

    const anythingBtnClass = classNames({
      hidden: (!expanded && !anything) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = classNames({
      'search-input': true,
      'type-search': true,
      invisible: !expanded,
    })

    const filteredClass = classNames({
      filtered: true,
      show: expanded || (!expanded && !anything),
    })

    const excludedClass = classNames({
      excluded: true,
      show: anything && !expanded && excludedTypes.length > 0 && excludedTypes.length !== types.length,
    })

    return (
      <div className={className}>
        <h1>Show Me</h1>
        <img className={searchBtnClass} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} role="presentation" />
        <img className={closeBtnClass} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} role="presentation" />
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
            <div className="except">ONLY IGNORING</div>
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
  fetchRecommendations,
  typeSelect,
}

export default connect(selectors, actions)(TypeSection)
