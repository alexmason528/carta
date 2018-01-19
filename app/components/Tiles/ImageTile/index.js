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

  constructor(props) {
    super(props)

    this.state = {
      imageLoaded: false,
    }
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
    const fontSize = width / 44 * 3 * 1.35 * (window.innerWidth < 768 ? 7 / 6 : 1)
    $(imageTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { img, title, type } = this.props
    const data = type ? {} : { xs: 12, sm: 12, md: 6, lg: 4 }

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
          <div className="tile imageTile Ov-H Cr-P">
            <Img onLoad={this.handleLoaded} src={img} />
            {imageLoaded && <h2 className="Mb-0 Tt-U Px-30 Py-19" dangerouslySetInnerHTML={{ __html: title }} />}
          </div>
        </div>
      </Col>
    )
  }
}

export default ImageTile
