import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import Img from 'components/Img'
import { S3_COVER_URL } from 'utils/globalConstants'
import './style.scss'

class ImageTile extends Component {
  static propTypes = {
    fullname: PropTypes.string,
    holidayPic: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = { imageLoaded: false }

    const rand = Math.floor(Math.random() * 77) + 1
    const filename = rand < 10 ? `000${rand}` : `00${rand}`
    this.holidayPic = `${S3_COVER_URL}/square/${filename}.jpg`
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
          <div className="tile friendTile Ov-H Cr-P">
            <Img onLoad={this.handleLoaded} src={holidayPic || this.holidayPic} />
            {imageLoaded && <h2 className="Mb-0 Tt-U Px-30 Py-19" dangerouslySetInnerHTML={{ __html: fullname }} />}
          </div>
        </div>
      </Col>
    )
  }
}

export default ImageTile