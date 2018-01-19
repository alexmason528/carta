import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { injectIntl, intlShape } from 'react-intl'
import { Col } from 'reactstrap'
import Img from 'components/Img'
import './style.scss'

class ThemeTile extends Component {
  static propTypes = {
    title: PropTypes.object,
    url: PropTypes.string,
    link: PropTypes.string,
    intl: intlShape.isRequired,
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
    const themeTile = ReactDOM.findDOMNode(this)
    const width = $(themeTile).width()
    const fontSize = width / 44 * 3 * 1.35 * (window.innerWidth < 768 ? 7 / 6 : 1)
    $(themeTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  handleTileClick = () => {
    const { link } = this.props
    browserHistory.push(`/quest/${link}`)
  }

  render() {
    const { imageLoaded } = this.state
    const { url, title, intl: { locale } } = this.props

    return (
      <Col className="tileCol" xs={12} sm={12} md={6} lg={4}>
        <div className="tileContainer" onClick={this.handleTileClick}>
          <div className="tile themeTile Ov-H Cr-P">
            <Img onLoad={this.handleLoaded} src={url} />
            {imageLoaded && <h2 className="Mb-0 Tt-U Px-30 Py-19" dangerouslySetInnerHTML={{ __html: title[locale] }} />}
          </div>
        </div>
      </Col>
    )
  }
}

export default injectIntl(ThemeTile)
