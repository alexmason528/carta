import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { createStructuredSelector } from 'reselect'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { fetchRecommendations, descriptiveSelect } from 'containers/QuestPage/actions'
import messages from 'containers/QuestPage/messages'
import { selectDescriptives, selectCurrentDescriptives } from 'containers/QuestPage/selectors'
import { Button, StarButton } from 'components/Buttons'

class DescriptiveSection extends Component {
  static propTypes = {
    className: PropTypes.string,
    descriptives: PropTypes.array,
    currentDescriptives: PropTypes.object,
    questIndex: PropTypes.number,
    descriptiveSelect: PropTypes.func,
    fetchRecommendations: PropTypes.func,
    intl: intlShape.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      descriptives: [],
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

    const { descriptives } = nextState
    const { className } = this.props

    for (let descriptive of descriptives) {
      if (descriptive.active) {
        closable = true
        break
      }
    }

    if (nextProps.className !== className) {
      nextState.expanded = !closable
    }
  }

  initializeState = props => {
    const { descriptives, currentDescriptives: { star, active } } = props

    const newDescriptives = descriptives.map(descriptive => {
      const { c } = descriptive
      const isStar = star.indexOf(c) !== -1
      const isActive = active.indexOf(c) !== -1

      return { ...descriptive, star: isStar, active: isStar || isActive }
    })

    this.setState({
      descriptives: newDescriptives,
    })
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
    const { descriptives, anything } = this.state
    let newDescriptives = descriptives.map(descriptive => ({ ...descriptive, star: anything ? false : descriptive.star, active: !anything, visible: !anything }))

    let stateData = {
      anything: !anything,
      descriptives: newDescriptives,
    }

    if (anything) {
      stateData.expanded = true
    }

    this.setState(stateData, this.handleFetchRecommendations)
  }

  handleDescriptiveClick = name => {
    const { descriptives } = this.state

    this.setState({
      descriptives: descriptives.map(descriptive => (descriptive.name === name) ? { ...descriptive, star: false, active: !descriptive.active } : descriptive),
    }, this.handleFetchRecommendations)
  }

  handleDescriptiveStarClick = name => {
    const { descriptives } = this.state

    this.setState({
      descriptives: descriptives.map(descriptive => (descriptive.name === name) ? { ...descriptive, star: !descriptive.star } : descriptive),
    }, this.handleFetchRecommendations)
  }

  handleFetchRecommendations = () => {
    const { descriptives, anything } = this.state
    const { descriptiveSelect, fetchRecommendations } = this.props

    let star = []
    let active = []
    let inactive = []

    descriptives.forEach(descriptive => {
      if (descriptive.star) {
        star.push(descriptive.c)
      } else if (descriptive.active) {
        active.push(descriptive.c)
      } else {
        inactive.push(descriptive.c)
      }
    })

    let questDescriptives = { anything, active, inactive, star }

    descriptiveSelect(questDescriptives)
    fetchRecommendations()
  }

  // handleDescriptiveClick = descriptiveName => {
  //   const { descriptiveSelect, questIndex, fetchRecommendations } = this.props
  //   let descriptives = [...this.state.descriptives]

  //   let newDescriptives = descriptives.map((descriptive, index) => {
  //     const { name, star, visible, active } = descriptive
  //     if (name === descriptiveName) {
  //       descriptiveSelect(name, 1, 1, 1, questIndex)
  //       return { name: name, star: 1, visible: 1, active: 1 }
  //     }
  //     return descriptive
  //   })

  //   this.setState({
  //     descriptives: newDescriptives,
  //   }, () => { fetchRecommendations() })
  // }

  render() {
    const { descriptives, expanded, anything, search } = this.state
    const { className, intl: { formatMessage } } = this.props

    let searchedDescriptives = (search === '') ? descriptives : descriptives.filter(descriptive => (descriptive.name.toLowerCase().indexOf(search) !== -1))

    let excludedDescriptives = descriptives.filter(descriptive => !descriptive.active)
    let staredDescriptives = descriptives.filter(descriptive => descriptive.star)
    let activeDescriptives = descriptives.filter(descriptive => descriptive.active)

    const searchBtnClass = classNames({
      search: true,
      invisible: expanded,
    })

    const closeBtnClass = classNames({
      close: true,
      invisible: !expanded || (!anything && staredDescriptives.length === 0 && activeDescriptives.length === 0),
    })

    const anythingBtnClass = classNames({
      hidden: (!expanded && !anything) || ('anything'.indexOf(search.toLowerCase()) === -1),
    })

    const searchInputClass = classNames({
      'search-input': true,
      'descriptive-search': true,
      invisible: !expanded,
    })

    const filteredClass = classNames({
      filtered: true,
      show: expanded || (!expanded && !anything),
    })

    const excludedClass = classNames({
      excluded: true,
      show: anything && !expanded && excludedDescriptives.length > 0 && excludedDescriptives.length !== descriptives.length,
    })

    const staredClass = classNames({
      stared: true,
      show: anything && staredDescriptives.length > 0,
    })

    return (
      <div className={className}>
        <h1>{ formatMessage(messages.knownfor) }</h1>
        <img className={searchBtnClass} src={`${CLOUDINARY_ICON_URL}/search.png`} onClick={() => { this.handleExpand(true) }} role="presentation" />
        <img className={closeBtnClass} src={`${CLOUDINARY_ICON_URL}/back.png`} onClick={() => { this.handleExpand(false) }} role="presentation" />
        <input className={searchInputClass} value={search} onChange={this.handleInputChange} />
        <div className="suggestions">
          <Button className={anythingBtnClass} active={anything} onClick={this.handleAnythingClick}>Anything</Button>
          <div className={filteredClass}>
            {
            searchedDescriptives.map((descriptive, index) => {
              const { name, star, active } = descriptive
              return (expanded || (star || active)) ? (
                <StarButton
                  key={index}
                  {...descriptive}
                  onMouseDown={() => { this.handleDescriptiveClick(name) }}
                  onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                >
                  {name}
                </StarButton>) : null
            })
            }
          </div>
          <div className={staredClass}>
            <div className="notable">{ formatMessage(messages.notably) }</div>
            {
              staredDescriptives.map((descriptive, index) => {
                const { name } = descriptive
                return (
                  <StarButton
                    key={index}
                    {...descriptive}
                    onMouseDown={() => { this.handleDescriptiveClick(name) }}
                    onStarClick={() => { this.handleDescriptiveStarClick(name) }}
                  >
                    {name}
                  </StarButton>
                )
              })
            }
          </div>
          <div className={excludedClass}>
            <div className="except">{ formatMessage(messages.onlyignoring) }</div>
            {
              excludedDescriptives.map((descriptive, index) => {
                const { name } = descriptive
                return (
                  <StarButton
                    key={index}
                    {...descriptives}
                    onMouseDown={() => { this.handleDescriptiveClick(name) }}
                    onStarClick={() => { this.handleDescriptiveStarClick(name) }}
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

export default injectIntl(connect(selectors, actions)(DescriptiveSection))
