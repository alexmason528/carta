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

  componentDidMount() {
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
  }

  render() {
    const { title, content, type } = this.props
    const data = type ? {} : { xs: 12, sm: 12, md: 6, lg: 4 }

    return (
      <Col
        className={cx({
          descriptionText: type === 'description',
          tileCol: !type,
        })}
        {...data}
      >
        <div className="tileContainer mobileTextTile">
          {title && <h2 className="textTile__title Tt-U Pb-20">{title}</h2>}
          <div className="textTile__content">{content}</div>
        </div>
      </Col>
    )
  }
}

export default TextTile
