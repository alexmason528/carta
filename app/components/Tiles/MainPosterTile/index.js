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
    const MainPosterTile = ReactDOM.findDOMNode(this)
    const width = $(MainPosterTile).width()
    const fontSize = width / 44 * 3 * 1.35 * (window.innerWidth < 768 ? 7 / 6 : 1)
    $(MainPosterTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })
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
