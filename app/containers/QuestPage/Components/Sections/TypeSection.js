import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fetchRecommendations, typeSelect } from 'containers/QuestPage/actions'
import { selectTypes, selectCurrentTypes } from 'containers/QuestPage/selectors'
import { Button, StarButton } from '../Buttons'

class TypeSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    types: PropTypes.array,
    currentTypes: PropTypes.object,
    typeSelect: PropTypes.func,
    fetchRecommendations: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      types: [],
      expanded: 1,
      anything: 0,
      search: '',
    }
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentDidMount() {
    setTimeout(() => {
      this.searchInput.focus()
    }, 500)
  }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }

  componentWillUpdate(nextProps, nextState) {
    let closable = 0

    const { types } = nextState
    const { className } = nextProps

    for (let tp of types) {
      if (tp.active === 1) {
        closable = 1
        break
      }
    }

    if (className !== this.props.className) {
      nextState.expanded = 1 - closable
    }

    setTimeout(() => {
      this.searchInput.focus()
    }, 500)
  }

  initializeState = props => {
    const { types, currentTypes } = props

    const newTypes = types.map(type => {
      if (currentTypes.active.indexOf(type.c) !== -1) {
        return { c: type.c, name: type.name, active: 1 }
      }
      return { c: type.c, name: type.name, active: 0 }
    })

    this.setState({
      types: newTypes,
    })
  }

  handleExpand = expanded => {
    let types = [...this.state.types]

    this.setState({
      expanded: expanded,
    })

    if (expanded === 0) {
      this.setState({
        search: '',
      })
    }
  }

  handleInputChange = evt => {
    this.setState({
      search: evt.target.value,
    })
  }

  handleAnythingClick = () => {
    const { types, anything } = this.state

    const newTypes = types.map(type => ({ c: type.c, name: type.name, active: 1 - anything }))

    let stateData = {
      anything: 1 - anything,
      types: newTypes,
    }

    if (anything === 1) {
      stateData.expanded = 1
    }

    this.setState(stateData, this.handleFetchRecommendations)
  }

  handleTypeClick = typeName => {
    const { types, expanded, anything } = this.state

    let newTypes = types.map((type, index) => {
      const { name, active } = type
      if (name === typeName) {
        return { c: type.c, name: name, active: 1 - active }
      }
      return type
    })

    this.setState({
      types: newTypes,
    }, this.handleFetchRecommendations)
  }

  handleFetchRecommendations = () => {
    const { typeSelect, fetchRecommendations } = this.props
    const { types, anything } = this.state

    let active = []
    let inactive = []

    types.forEach(type => (type.active === 1) ? active.push(type.c) : inactive.push(type.c))

    let questTypes = {
      anything: anything,
      active: active,
      inactive: inactive,
    }

    typeSelect(questTypes)
    fetchRecommendations()
  }

  render() {
    const { types, expanded, anything, search } = this.state
    const { className } = this.props

    let searchedTypes = []
    if (search === '') searchedTypes = types
    else searchedTypes = types.filter(type => type.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)

    let excludedTypes = types.filter(type => type.active === 0)
    let activeTypes = types.filter(type => type.active === 1)

    const searchBtnClass = classNames({
      search: true,
      invisible: expanded === 1,
    })

    const closeBtnClass = classNames({
      close: true,
      invisible: expanded === 0 || (anything === 0 && activeTypes.length === 0),
    })

    const anythingBtnClass = classNames({
      hidden: (expanded === 0 && anything === 0) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = classNames({
      'search-input': true,
      'type-search': true,
      invisible: expanded === 0,
    })

    const filteredClass = classNames({
      filtered: true,
      show: expanded === 1 || (expanded === 0 && anything === 0),
    })

    const excludedClass = classNames({
      excluded: true,
      show: anything === 1 && expanded === 0 && excludedTypes.length > 0 && excludedTypes.length !== types.length,
    })

    return (
      <div className={className}>
        <h1>Show Me</h1>
        <img className={searchBtnClass} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/search.png" onClick={() => { this.handleExpand(1) }} role="presentation" />
        <img className={closeBtnClass} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/back.png" onClick={() => { this.handleExpand(0) }} role="presentation" />
        <input ref={input => { this.searchInput = input }} className={searchInputClass} value={search} onChange={evt => { this.handleInputChange(evt) }} />
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
            searchedTypes.map((type, index) => {
              const { name, active } = type
              let button

              if (expanded === 1) {
                button = (
                  <Button
                    active={active}
                    onClick={() => { this.handleTypeClick(name) }}
                    key={index}
                  >
                    {name}
                  </Button>
                )
              } else if (active === 1) {
                button = (
                  <Button
                    active={active}
                    onClick={() => { this.handleTypeClick(name) }}
                    key={index}
                  >
                    {name}
                  </Button>
                )
              }
              return button
            })
          }
          </div>
          <div className={excludedClass}>
            <div className="except">ONLY IGNORING</div>
            {
              excludedTypes.map((type, index) => {
                const { name, active } = type
                return (
                  <Button
                    active={active}
                    onClick={() => { this.handleTypeClick(name) }}
                    key={index}
                  >
                    {name}
                  </Button>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  types: selectTypes(),
  currentTypes: selectCurrentTypes(),
})

const actions = {
  fetchRecommendations,
  typeSelect,
}

export default connect(mapStateToProps, actions)(TypeSection)
