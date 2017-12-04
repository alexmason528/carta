import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import cx from 'classnames'
import Img from 'components/Img'
import './style.scss'

class ImageTile extends Component {
  static propTypes = {
    img: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const imageTile = ReactDOM.findDOMNode(this)
    const width = $(imageTile).width()
    $(imageTile).find('h2').css({ fontSize: `${(width / 44) * 3 * 1.35}px` })
  }

  handleLoaded = () => {
    this.handleResize()
  }

  render() {
    const { img, title, type } = this.props
    const data = type ? {} : { lg: 4, md: 6, sm: 12, xs: 12 }

    return (
      <Col
        className={cx({
          mainPoster: type === 'main',
          descriptionPoster: type === 'description',
          tileCol: !type,
        })}
        {...data}
      >
        <div className="tileContainer">
          <div className="tile imageTile">
            <Img onLoad={this.handleLoaded} src={img} />
            <h2 dangerouslySetInnerHTML={{ __html: title }} />
          </div>
        </div>
      </Col>
    )
  }
}

export default ImageTile