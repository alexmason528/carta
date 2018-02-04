import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import cx from 'classnames'
import Img from 'components/Img'
import { S3_FIXED_URL } from 'utils/globalConstants'
import './style.scss'

class FixedTile extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    title: PropTypes.string,
    img: PropTypes.string,
    buttonText: PropTypes.string,
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

  handleButtonClick = evt => {
    evt.stopPropagation()
    const { onClick } = this.props
    onClick()
  }

  render() {
    const { imageLoaded } = this.state
    const { title, img, buttonText, link } = this.props
    return (
      <div className={cx({ fixedTile: true, hidden: !imageLoaded })} onClick={() => browserHistory.push(link)}>
        {buttonText && (
          <button className="fixedTile__btn" onClick={this.handleButtonClick}>
            {buttonText}
          </button>
        )}
        <div className="fixedTile__content">
          <Img className="fixedTile__image" onLoad={this.handleLoaded} src={`${S3_FIXED_URL}/${img}`} />
          <h2 className="fixedTile__title" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
      </div>
    )
  }
}

export default FixedTile
