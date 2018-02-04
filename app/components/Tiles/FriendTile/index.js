import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import Img from 'components/Img'
import { S3_HOLIDAY_IMAGE_URL } from 'utils/globalConstants'
import { getFirstname } from 'utils/stringHelper'
import './style.scss'

class ImageTile extends Component {
  static propTypes = {
    fullname: PropTypes.string,
    holidayPic: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = { imageLoaded: false }

    const filename = `${Math.floor(Math.random() * 52) + 1}.jpg`
    this.holidayPic = `${S3_HOLIDAY_IMAGE_URL}/${filename}`
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const friendTile = ReactDOM.findDOMNode(this)
    const width = $(friendTile).width()
    const fontSize = width / 44 * 3 * 1.35 * (window.innerWidth < 768 ? 7 / 6 : 1)
    $(friendTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { fullname, holidayPic } = this.props

    return (
      <Col className="tileCol" xs={12} sm={12} md={6} lg={4}>
        <div className="tileContainer">
          <div className="tile friendTile">
            <Img onLoad={this.handleLoaded} src={holidayPic || this.holidayPic} />
            {imageLoaded && <h2 dangerouslySetInnerHTML={{ __html: getFirstname(fullname) }} />}
          </div>
        </div>
      </Col>
    )
  }
}

export default ImageTile
