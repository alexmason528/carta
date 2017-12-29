import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import { browserHistory } from 'react-router'
import { CLOUDINARY_FIXED_URL } from 'containers/App/constants'
import Img from 'components/Img'
import './style.scss'

class FixedTile extends Component {
  static propTypes = {
    authenticated: PropTypes.bool,
    title: PropTypes.string,
    img: PropTypes.string,
    message: PropTypes.string,
    link: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.state = { imageLoaded: false }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const quest = ReactDOM.findDOMNode(this)
    const width = $(quest).width()
    $(quest)
      .find('h2')
      .css({ fontSize: `${width / 44 * 3 * 1.15}px` })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, this.handleResize)
  }

  render() {
    const { imageLoaded } = this.state
    const { authenticated, title, img, message, link } = this.props

    return (
      <div
        className={cx({
          fixedTile: true,
          hidden: !imageLoaded,
          'Mb-8': true,
          'P-R': true,
        })}
        onClick={() => browserHistory.push(link)}
      >
        <div className="fixedTile__content Cr-P Ov-H">
          <Img
            className="fixedTile__image"
            onLoad={this.handleLoaded}
            src={`${CLOUDINARY_FIXED_URL}/${img}`}
          />
          <h2
            className="fixedTile__title Tt-U Mb-0 Px-30 Py-19"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {authenticated && (
            <h5
              className="fixedTile__message Tt-U Fw-B P-A Fz-14"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        </div>
      </div>
    )
  }
}

export default FixedTile
