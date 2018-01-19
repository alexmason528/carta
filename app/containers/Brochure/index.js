import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Container, Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router'
import { getBrochureInfoRequest, setQuest } from 'containers/QuestPage/actions'
import { selectBrochureInfo } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import ResponsiveLayout from 'components/ResponsiveLayout'
import { ImageTile, TextTile, TextTileMobile } from 'components/Tiles'
import { S3_ICON_URL } from 'utils/globalConstants'
import { urlParser } from 'utils/urlHelper'
import './style.scss'

class Brochure extends Component {
  static propTypes = {
    getBrochureInfoRequest: PropTypes.func,
    setQuest: PropTypes.func,
    params: PropTypes.object,
    router: PropTypes.object,
    brochureInfo: PropTypes.object,
    brochureLink: PropTypes.string,
  }

  componentDidMount() {
    const { getBrochureInfoRequest, brochureLink } = this.props
    getBrochureInfoRequest(brochureLink)
  }

  handleBrochureClose = () => {
    const { params, setQuest } = this.props
    setQuest({
      quest: urlParser({ ...params, brochure: undefined }),
      urlEntered: true,
    })
  }

  handleBrochureResize = () => {}

  render() {
    const { brochureInfo } = this.props
    if (!brochureInfo) return null

    const { info: { mainPoster, description, tiles } } = brochureInfo

    return (
      <Container fluid className="brochure P-0 M-0">
        <div className="brochure__menu">
          {/* <button
            className="P-5 Ml-2 Lh-100P Cr-P"
            onClick={this.handleBrochureResize}
          >
            <Img className="Sq-15" src={`${S3_ICON_URL}/narrow.png`} />
          </button> */}
          <button className="P-5 Ml-2 Lh-100P Cr-P" onClick={this.handleBrochureAddtoStarlist}>
            <Img className="Sq-15" src={`${S3_ICON_URL}/narrow.png`} />
          </button>
          <button className="P-5 Ml-2 Lh-100P Cr-P" onClick={this.handleBrochureClose}>
            <Img className="Sq-15" src={`${S3_ICON_URL}/close.png`} />
          </button>
        </div>
        <Row className="brochure__row">
          {mainPoster && (
            <Col lg={8} md={12} sm={12} xs={12} className="brochure__col">
              <ImageTile type="main" img={mainPoster.url} title={mainPoster.title} />
            </Col>
          )}
          {description && (
            <Col lg={4} md={12} sm={12} xs={12} className="brochure__col">
              <Row className="brochure__row">
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <ResponsiveLayout
                    desktop={<TextTile type="description" title={''} content={description.text.content} />}
                    tablet={<TextTile type="description" title={''} content={description.text.content} />}
                    mobile={<TextTileMobile type="description" title={''} content={description.text.content} />}
                  />
                </Col>
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <ImageTile type="description" img={description.poster.url} title={description.poster.title} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        <Row className="brochure__row">
          {tiles &&
            tiles.map((tile, index) => {
              const { content, title, type, url } = tile
              return type === 'text' ? (
                <ResponsiveLayout
                  key={index}
                  desktop={<TextTile title={title} content={content} />}
                  tablet={<TextTile title={title} content={content} />}
                  mobile={<TextTileMobile title={title} content={content} />}
                />
              ) : (
                <ImageTile img={url} title={title} key={index} />
              )
            })}
        </Row>
      </Container>
    )
  }
}

const selectors = createStructuredSelector({
  brochureInfo: selectBrochureInfo(),
})

const actions = {
  getBrochureInfoRequest,
  setQuest,
}

export default compose(withRouter, connect(selectors, actions))(Brochure)
