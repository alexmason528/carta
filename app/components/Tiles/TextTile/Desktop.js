import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import cx from 'classnames'
import './style.scss'

class TextTile extends Component {
  static propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    type: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      expanded: false,
    }
  }

  componentDidMount() {
    const comp = ReactDOM.findDOMNode(this)
    $(comp)
      .find('.textTile__content')
      .dotdotdot({
        watch: 'window',
        ellipsis: ' ...',
      })

    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const tile = ReactDOM.findDOMNode(this)
    const width = $(tile).width()
    const fontSize = width / 76 * 3 * 1.15 * 1.25
    $(tile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })

    const { expanded } = this.state

    if (expanded) {
      $(tile).css({ zIndex: 20 })
      $(tile)
        .find('.textTile')
        .css({ bottom: 'calc(-100% - 8px)' })
    } else {
      $(tile)
        .find('.textTile')
        .css({ bottom: 0, zIndex: 1 })
    }

    setTimeout(() => {
      $(tile)
        .find('.textTile__content')
        .trigger('update.dot')
      $(tile)
        .find('.arrowBtn')
        .css(
          'display',
          $(tile).find('.is-truncated').length > 0 || expanded
            ? 'block'
            : 'none'
        )
    }, 200)

    if (!expanded) {
      setTimeout(() => {
        $(tile).css({ zIndex: 1 })
      }, 250)
    }
  }

  handleToggleExpand = () => {
    this.setState({ expanded: !this.state.expanded }, this.handleResize)
  }

  render() {
    const { title, content, type } = this.props
    const { expanded } = this.state
    const data = type ? {} : { xs: 12, sm: 12, md: 6, lg: 4 }

    return (
      <Col
        className={cx({
          descriptionText: type === 'description',
          tileCol: !type,
        })}
        {...data}
      >
        <div className="tileContainer">
          <div className="tile textTile Ov-H">
            <h2 className="textTile__title Tt-U Pb-20">{title}</h2>
            <div className="textTile__content">{content}</div>
            <div
              className={cx({
                arrowBtn: true,
                'Cr-P': true,
                more: !expanded,
                less: expanded,
              })}
              onClick={this.handleToggleExpand}
            />
          </div>
        </div>
      </Col>
    )
  }
}

export default TextTile
