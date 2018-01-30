import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { Col } from 'reactstrap'
import { RemoveButton } from 'components/Buttons'
import Img from 'components/Img'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import './style.scss'

class WishlistTile extends Component {
  static propTypes = {
    onDelete: PropTypes.func,
    title: PropTypes.string,
    brochureID: PropTypes.string,
    url: PropTypes.string,
    quest: PropTypes.string,
    canDelete: PropTypes.bool,
    deleting: PropTypes.bool,
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
    const wishlistTile = ReactDOM.findDOMNode(this)
    const width = $(wishlistTile).width()
    const fontSize = width / 44 * 3 * 1.35 * (window.innerWidth < 768 ? 7 / 6 : 1)
    $(wishlistTile)
      .find('h2')
      .css({ fontSize: `${fontSize}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  handleTileClick = () => {
    const { quest } = this.props
    browserHistory.push(quest)
  }

  handleRemoveWishlist = evt => {
    evt.stopPropagation()
    const { brochureID, onDelete } = this.props
    onDelete(brochureID)
  }

  render() {
    const { imageLoaded } = this.state
    const { url, title, canDelete, deleting } = this.props

    return (
      <Col className="tileCol" xs={12} sm={12} md={6} lg={4}>
        <div className="tileContainer" onClick={this.handleTileClick}>
          <div className="tile wishlistTile Ov-H Cr-P">
            <LoadingSpinner show={deleting}>
              <QuarterSpinner width={30} height={30} />
            </LoadingSpinner>
            <Img onLoad={this.handleLoaded} src={url} />
            {imageLoaded && <h2 className="Mb-0 Tt-U Px-30 Py-19" dangerouslySetInnerHTML={{ __html: title }} />}
            {canDelete && <RemoveButton type="image" className="wishlistRemoveBtn" onClick={this.handleRemoveWishlist} />}
          </div>
        </div>
      </Col>
    )
  }
}

export default WishlistTile
