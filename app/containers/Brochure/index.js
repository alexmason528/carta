import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Container, Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { withRouter } from 'react-router'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { getBrochureRequest, clearBrochure } from 'containers/QuestPage/actions'
import { selectBrochure } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import { ImageTile, TextTile } from 'components/Tiles'
import './style.scss'

class Brochure extends Component {
  static propTypes = {
    getBrochureRequest: PropTypes.func,
    clearBrochure: PropTypes.func,
    params: PropTypes.object,
    brochure: PropTypes.object,
    link: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { getBrochureRequest, link } = this.props
    getBrochureRequest(link)
  }

  handleBrochureClose = () => {
    const { clearBrochure } = this.props
    clearBrochure()
  }

  handleBrochureResize = () => {}

  render() {
    const { brochure } = this.props
    if (!brochure) return null
    console.log(brochure)

    const { info: { mainPoster, description, tiles } } = brochure

    return (
      <Container fluid className="brochure P-0 M-0">
        <div className="brochure__menu">
          <button
            className="P-5 Ml-2 Lh-100P Cr-P"
            onClick={this.handleBrochureResize}
          >
            <Img className="Sq-15" src={`${CLOUDINARY_ICON_URL}/narrow.png`} />
          </button>
          <button
            className="P-5 Ml-2 Lh-100P Cr-P"
            onClick={this.handleBrochureClose}
          >
            <Img className="Sq-15" src={`${CLOUDINARY_ICON_URL}/close.png`} />
          </button>
        </div>
        <Row className="brochure__row">
          {mainPoster && (
            <Col md={8} sm={12} xs={12} className="brochure__col">
              <ImageTile
                type="main"
                img={mainPoster.url}
                title={mainPoster.title}
              />
            </Col>
          )}
          {description && (
            <Col md={4} sm={12} xs={12} className="brochure__col">
              <Row className="brochure__row">
                <Col lg={12} md={12} sm={6} xs={12} className="brochure__col">
                  <TextTile
                    type="description"
                    title={''}
                    content={description.text.content}
                  />
                </Col>
                <Col lg={12} md={12} sm={6} xs={12} className="brochure__col">
                  <ImageTile
                    type="description"
                    img={description.poster.url}
                    title={description.poster.title}
                  />
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
                <TextTile title={title} content={content} key={index} />
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
  brochure: selectBrochure(),
})

const actions = {
  getBrochureRequest,
  clearBrochure,
}

export default compose(withRouter, connect(selectors, actions))(Brochure)
