import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { Col } from 'reactstrap'
import Img from 'components/Img'
import './style.scss'

class PlaceTile extends Component {
  static propTypes = {
    title: PropTypes.string,
    url: PropTypes.string,
    link: PropTypes.string,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const placeTile = ReactDOM.findDOMNode(this)
    const width = $(placeTile).width()
    $(placeTile)
      .find('h2')
      .css({ fontSize: `${width / 44 * 3 * 1.35}px` })
  }

  handleLoaded = () => {
    this.handleResize()
  }

  handleTileClick = () => {
    const { link } = this.props
    browserHistory.push(`/quest/in/${link}`)
  }

  render() {
    const { url, title } = this.props

    return (
      <Col className="tileCol" xs={12} sm={12} md={6} lg={4}>
        <div className="tileContainer" onClick={this.handleTileClick}>
          <div className="tile placeTile Ov-H Cr-P">
            <Img onLoad={this.handleLoaded} src={url} />
            <h2
              className="Mb-0 Tt-U Px-30 Py-19"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
        </div>
      </Col>
    )
  }
}

export default PlaceTile