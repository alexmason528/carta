import React, { Component, PropTypes, Children } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, StarButton } from './Buttons'
import { fetchRecommendations, descriptiveSelect } from '../actions'
import { selectDescriptives, selectCurrentDescriptives } from '../selectors'
import '../style.scss'

class DescriptivesPage extends Component {
  constructor() {
    super()

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

  // componentDidMount() {
  //   this.timerID = null
  //   const component = this

  //   $('body').delegate('.button-wrapper button', 'mousedown mouseup', function(e) {
  //     if (e.type == 'mousedown') {
  //       clearTimeout(this.timerID)
  //       if(!$(this).parent().hasClass('active')) {
  //         this.timerID = setTimeout(() => {
  //           component.descriptiveClickHoldHandler(e.currentTarget.textContent)
  //         }, 200)
  //       }
  //     } else if (e.type == 'mouseup') {
  //       clearTimeout(this.timerID)
  //     }
  //   })
  // }

  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }

  componentWillUpdate(nextProps, nextState) {
    let closable = 0

    const { descriptives } = nextState
    const { className } = nextProps

    for (let descriptive of descriptives) {
      if (descriptive.active === 1) {
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

  expandHandler = expanded => {
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

  inputChangeHandler = text => {
    this.setState({
      search: text,
    })
  }

  anythingClickHandler = () => {
    const { descriptives, anything } = this.state
    let newDescriptives = descriptives.map(descriptive => ({ c: descriptive.c, name: descriptive.name, star: anything === 1 ? 0 : descriptive.star, active: 1 - anything }))

    let stateData = {
      anything: 1 - anything,
      descriptives: newDescriptives,
    }

    if (anything === 1) {
      stateData.expanded = 1
    }

    this.setState(stateData, this.fetchRecommendations)
  }

  descriptiveClickHandler = descriptiveName => {
    const { descriptives } = this.state

    let newDescriptives = descriptives.map((descriptive, index) => {
      const { c, name, star, active } = descriptive
      return (name === descriptiveName) ? { c, name, star: 0, active: 1 - active } : descriptive
    })

    this.setState({
      descriptives: newDescriptives,
    }, this.fetchRecommendations)
  }

  descriptiveStarClickHandler = descriptiveName => {
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
    }, this.fetchRecommendations)
  }

  fetchRecommendations = () => {
    const { descriptives, anything } = this.state

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

    this.props.descriptiveSelect(questDescriptives)
    this.props.fetchRecommendations()
  }

  // descriptiveClickHoldHandler = descriptiveName => {
  //   let descriptives = [...this.state.descriptives]

  //   let newDescriptives = descriptives.map((descriptive, index) => {
  //     const { name, star, visible, active } = descriptive
  //     if (name === descriptiveName) {
  //       this.props.descriptiveSelect(name, 1, 1, 1, this.props.questIndex)
  //       return { name: name, star: 1, visible: 1, active: 1 }
  //     }
  //     return descriptive
  //   })

  //   this.setState({
  //     descriptives: newDescriptives,
  //   })

  //   this.props.fetchRecommendations()
  // }

  render() {
    const { descriptives, expanded, anything, search } = this.state

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
      <div className={this.props.className}>
        <h1>Known For</h1>
        <img className={searchBtnClass} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/search.png" onClick={() => { this.expandHandler(1) }} role="presentation" />
        <img className={closeBtnClass} src="http://res.cloudinary.com/hyvpvyohj/raw/upload/v1506784801/image/icon/back.png" onClick={() => { this.expandHandler(0) }} role="presentation" />
        <input ref={input => { this.searchInput = input }} className={searchInputClass} value={search} onChange={evt => { this.inputChangeHandler(evt.target.value) }} />
        <div className="suggestions">
          <Button
            className={anythingBtnClass}
            active={anything}
            onClick={this.anythingClickHandler}
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
                      onMouseDown={() => { this.descriptiveClickHandler(name) }}
                      onStarClick={() => { this.descriptiveStarClickHandler(name) }}
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
                      onMouseDown={() => { this.descriptiveClickHandler(name) }}
                      onStarClick={() => { this.descriptiveStarClickHandler(name) }}
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
                    onMouseDown={() => { this.descriptiveClickHandler(name) }}
                    onStarClick={() => { this.descriptiveStarClickHandler(name) }}
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
                    onMouseDown={() => { this.descriptiveClickHandler(name) }}
                    onStarClick={() => { this.descriptiveStarClickHandler(name) }}
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

DescriptivesPage.propTypes = {
  className: PropTypes.string,
  descriptives: PropTypes.array,
  currentDescriptives: PropTypes.object,
  questIndex: PropTypes.number,
  descriptiveSelect: PropTypes.func,
  fetchRecommendations: PropTypes.func,
}

function mapDispatchToProps(dispatch) {
  return {
    descriptiveSelect: (descriptiveInfo) => dispatch(descriptiveSelect(descriptiveInfo)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  }
}

const mapStateToProps = createStructuredSelector({
  descriptives: selectDescriptives(),
  currentDescriptives: selectCurrentDescriptives(),
})

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(DescriptivesPage)
