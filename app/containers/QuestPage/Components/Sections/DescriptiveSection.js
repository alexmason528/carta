import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { fetchRecommendations, descriptiveSelect } from 'containers/QuestPage/actions'
import { selectDescriptives, selectCurrentDescriptives } from 'containers/QuestPage/selectors'
import { Button, StarButton } from '../Buttons'

class DescriptiveSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    descriptives: PropTypes.array,
    currentDescriptives: PropTypes.object,
    questIndex: PropTypes.number,
    descriptiveSelect: PropTypes.func,
    fetchRecommendations: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      descriptives: [],
      expanded: 1,
      anything: 0,
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
    let closable = 0

    const { descriptives } = nextState
    const { className } = this.props

    for (let descriptive of descriptives) {
      if (descriptive.active === 1) {
        closable = 1
        break
      }
    }

    if (nextProps.className !== className) {
      nextState.expanded = 1 - closable
    }
  }

  initializeState = props => {
    const { descriptives, currentDescriptives } = props

    const newDescriptives = descriptives.map(descriptive => {
      if (currentDescriptives.star.indexOf(descriptive.c) !== -1) {
        return { c: descriptive.c, name: descriptive.name, star: 1, active: 1 }
      } else if (currentDescriptives.active.indexOf(descriptive.c) !== -1) {
        return { c: descriptive.c, name: descriptive.name, star: 0, active: 1 }
      }
      return { c: descriptive.c, name: descriptive.name, star: 0, active: 0 }
    })

    this.setState({
      descriptives: newDescriptives,
    })
  }

  handleExpand = expanded => {
    let descriptives = [...this.state.descriptives]

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
    const { descriptives, anything } = this.state
    let newDescriptives = descriptives.map(descriptive => ({ c: descriptive.c, name: descriptive.name, star: anything === 1 ? 0 : descriptive.star, active: 1 - anything }))

    let stateData = {
      anything: 1 - anything,
      descriptives: newDescriptives,
    }

    if (anything === 1) {
      stateData.expanded = 1
    }

    this.setState(stateData, this.handleFetchRecommendations)
  }

  handleDescriptiveClick = descriptiveName => {
    const { descriptives } = this.state

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { c, name, star, active } = descriptive
      return (name === descriptiveName) ? { c, name, star: 0, active: 1 - active } : descriptive
    })

    this.setState({
      descriptives: newDescriptives,
    }, this.handleFetchRecommendations)
  }

  handleDescriptiveStarClick = descriptiveName => {
    const { descriptives } = this.state

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { c, name, star, active } = descriptive
      if (name === descriptiveName) {
        const newStar = 1 - star
        return { c, name, star: 1 - star, active }
      }
      return descriptive
    })

    this.setState({
      descriptives: newDescriptives,
    }, this.handleFetchRecommendations)
  }

  handleFetchRecommendations = () => {
    const { descriptives, anything } = this.state
    const { descriptiveSelect, fetchRecommendations } = this.props

    let star = []
    let active = []
    let inactive = []

    descriptives.forEach(descriptive => {
      if (descriptive.star === 1) {
        star.push(descriptive.c)
      } else if (descriptive.active === 1) {
        active.push(descriptive.c)
      } else {
        inactive.push(descriptive.c)
      }
    })

    let questDescriptives = {
      anything: anything,
      active: active,
      inactive: inactive,
      star: star,
    }

    descriptiveSelect(questDescriptives)
    fetchRecommendations()
  }

  handleDescriptiveClick = descriptiveName => {
    const { descriptiveSelect, questIndex, fetchRecommendations } = this.props
    let descriptives = [...this.state.descriptives]

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { name, star, visible, active } = descriptive
      if (name === descriptiveName) {
        descriptiveSelect(name, 1, 1, 1, questIndex)
        return { name: name, star: 1, visible: 1, active: 1 }
      }
      return descriptive
    })

    this.setState({
      descriptives: newDescriptives,
    })

    fetchRecommendations()
  }

  render() {
    const { descriptives, expanded, anything, search } = this.state
    const { className } = this.props

    let searchedDescriptives = []
    if (search === '') searchedDescriptives = descriptives
    else searchedDescriptives = descriptives.filter(descriptive => (descriptive.name.toLowerCase().indexOf(search) !== -1))

    let excludedDescriptives = descriptives.filter(descriptive => descriptive.active === 0)
    let staredDescriptives = descriptives.filter(descriptive => descriptive.star === 1)
    let activeDescriptives = descriptives.filter(descriptive => descriptive.active === 1)

    const searchBtnClass = classNames({
      search: true,
      invisible: expanded === 1,
    })

    const closeBtnClass = classNames({
      close: true,
      invisible: expanded === 0 || (anything === 0 && staredDescriptives.length === 0 && activeDescriptives.length === 0),
    })

    const anythingBtnClass = classNames({
      hidden: (expanded === 0 && anything === 0) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = classNames({
      'search-input': true,
      'descriptive-search': true,
      invisible: expanded === 0,
    })

    const filteredClass = classNames({
      filtered: true,
      show: expanded === 1 || (expanded === 0 && anything === 0),
    })

    const excludedClass = classNames({
      excluded: true,
      show: anything === 1 && expanded === 0 && excludedDescriptives.length > 0 && excludedDescriptives.length !== descriptives.length,
    })

    const staredClass = classNames({
      stared: true,
      show: anything === 1 && staredDescriptives.length > 0,
    })

    return (
      <div className={className}>
        <h1>Known For</h1>
        <img className={searchBtnClass} src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/search.png" onClick={() => { this.handleExpand(1) }} role="presentation" />
        <img className={closeBtnClass} src="https://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/back.png" onClick={() => { this.handleExpand(0) }} role="presentation" />
        <input className={searchInputClass} value={search} onChange={this.handleInputChange} />
        <div className="suggestions">
          <Button
            className={anythingBtnClass}
            active={anything}
            onClick={this.handleAnythingClick}
          >
            Anything
          </Button>
          <div className={filteredClass}>
            {
              searchedDescriptives.map((descriptive, index) => {
                const { name, star, active } = descriptive
                let starButton

                if (expanded === 1) {
                  starButton = (
                    <StarButton
                      active={active}
                      star={star}
                      onMouseDown={() => { this.handleDescriptiveClick(name) }}
                      onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                      key={index}
                    >
                      {name}
                    </StarButton>
                  )
                } else if (star === 1 || active === 1) {
                  starButton = (
                    <StarButton
                      active={active}
                      star={star}
                      onMouseDown={() => { this.handleDescriptiveClick(name) }}
                      onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                      key={index}
                    >
                      {name}
                    </StarButton>
                  )
                }

                return starButton
              })
          }
          </div>
          <div className={staredClass}>
            <div className="notable">NOTABLY</div>
            {
              staredDescriptives.map((descriptive, index) => {
                const { name, star, active } = descriptive
                return (
                  <StarButton
                    active={active}
                    star={star}
                    onMouseDown={() => { this.handleDescriptiveClick(name) }}
                    onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                    key={index}
                  >
                    {name}
                  </StarButton>
                )
              })
            }
          </div>
          <div className={excludedClass}>
            <div className="except">ONLY IGNORING</div>
            {
              excludedDescriptives.map((descriptive, index) => {
                const { name, star, active } = descriptive
                return (
                  <StarButton
                    active={active}
                    star={star}
                    onMouseDown={() => { this.handleDescriptiveClick(name) }}
                    onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                    key={index}
                  >
                    {name}
                  </StarButton>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  descriptives: selectDescriptives(),
  currentDescriptives: selectCurrentDescriptives(),
})

const actions = {
  descriptiveSelect,
  fetchRecommendations,
}

export default connect(selectors, actions)(DescriptiveSection)
