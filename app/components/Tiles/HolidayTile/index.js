import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Col } from 'reactstrap'
import Img from 'components/Img'
import { UPDATE_HOLIDAY_PIC_REQUEST } from 'containers/FriendsPage/constants'
import { EditButton } from 'components/Buttons'
import LoadingSpinner from 'components/LoadingSpinner'
import { QuarterSpinner } from 'components/SvgIcon'
import { S3_COVER_URL, S3_USER_HOLIDAY_IMAGE_URL } from 'utils/globalConstants'
import { getCroppedImage, imageUploader } from 'utils/imageHelper'
import { getFirstname } from 'utils/stringHelper'
import './style.scss'

class HolidayTile extends Component {
  static propTypes = {
    updateHolidayPic: PropTypes.func,
    user: PropTypes.object,
    holidayPic: PropTypes.string,
    fullname: PropTypes.string,
    canUpdate: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      imageLoaded: false,
      imageUpload: {
        uploading: false,
        error: null,
      },
    }

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
    const { canUpdate } = this.props
    if (canUpdate) {
      this.mediaUploader.click()
    }
  }

  handleFiles = evt => {
    const file = evt.target.files[0]
    getCroppedImage(file, this.handleImage, 'portrait')
  }

  handleImage = img => {
    const { updateHolidayPic } = this.props

    this.setState({ imageUpload: { uploading: true, error: null } })

    imageUploader(S3_USER_HOLIDAY_IMAGE_URL, img, (err, url) => {
      if (err) {
        this.setState({
          imageUpload: { uploading: false, error: err.toString() },
        })
      } else {
        updateHolidayPic({ holidayPic: url })
        this.setState({ imageUpload: { uploading: false, error: null } })
      }
    })
  }

  render() {
    const { imageLoaded, imageUpload } = this.state
    const { holidayPic, fullname } = this.props

    const spinnerShow = imageUpload.uploading || status === UPDATE_HOLIDAY_PIC_REQUEST

    return (
      <Col className="tileCol" xs={12} sm={12} md={6} lg={4}>
        <div className="tileContainer" onClick={this.handleTileClick}>
          <div className="tile friendTile Ov-H Cr-P P-R">
            <LoadingSpinner show={spinnerShow}>
              <QuarterSpinner width={30} height={30} />
            </LoadingSpinner>
            <Img onLoad={this.handleLoaded} src={holidayPic || this.holidayPic} />
            {imageLoaded && <h2 className="Mb-0 Tt-U Px-30 Py-19" dangerouslySetInnerHTML={{ __html: getFirstname(fullname) }} />}
            <input
              type="file"
              ref={ref => {
                this.mediaUploader = ref
              }}
              accept="image/*"
              onChange={this.handleFiles}
            />
            <EditButton className="updateBtn" white onClick={this.handleTileClick} />
          </div>
        </div>
      </Col>
    )
  }
}

export default HolidayTile
