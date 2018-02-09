import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_ICON_URL } from 'utils/globalConstants'
import './style.scss'

class MainPosterTile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.string,
    url: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string,
  }

  constructor(props) {
    super(props)

    const { type, url } = props
    let imageLoaded

    if (type === 'image' || type === 'video') {
      imageLoaded = !url
    } else {
      imageLoaded = true
    }

    this.state = { imageLoaded }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const { type } = this.props
    const isMobile = window.innerWidth < 768
    const isLandscape = window.innerWidth > window.innerWidth
    const mainPosterTile = ReactDOM.findDOMNode(this)
    const width = $(mainPosterTile).width()
    const height = $(mainPosterTile).height()
    const fontSize = width / 44 * 3 * 1.35 * (isMobile ? 7 / 6 : 1)
    $(mainPosterTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })

    if (type === 'video') {
      const playButton = $(mainPosterTile).find('.mainPosterTile__playButton')
      if (!isMobile || isLandscape) {
        playButton.css({ top: `${window.innerHeight / 2}px`, left: `${width / 2}px` })
      } else {
        playButton.css({ top: `${height / 2}px`, left: `${width / 2}px` })
      }
    }
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { type, url, title, onClick } = this.props

    return (
      <Col className={cx({ mainPoster: true, 'Cr-P': !!url })} onClick={onClick}>
        <div className="tileContainer">
          {type === 'panorama' ? (
            <div className="tile mainPosterTile">
              <iframe className="mainPosterTile__panorama" frameBorder="0" src={url} />
              <h2 className="mainPosterTile__title" dangerouslySetInnerHTML={{ __html: title }} />
            </div>
          ) : (
            <div className="tile mainPosterTile">
              {url && <Img className="mainPosterTile__img" onLoad={this.handleLoaded} src={url} />}
              {imageLoaded && <h2 className="mainPosterTile__title" dangerouslySetInnerHTML={{ __html: title }} />}
              {type === 'video' && <Img src={`${S3_ICON_URL}/play.png`} className="mainPosterTile__playButton" />}
            </div>
          )}
        </div>
      </Col>
    )
  }
}

export default MainPosterTile
