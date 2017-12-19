import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Container, Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { browserHistory, withRouter } from 'react-router'
import { CLOUDINARY_ICON_URL } from 'containers/App/constants'
import { getBrochureRequest } from 'containers/QuestPage/actions'
import { selectBrochure } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import { ImageTile, TextTile } from 'components/Tiles'
import './style.scss'

class Brochure extends Component {
  static propTypes = {
    getBrochureRequest: PropTypes.func,
    params: PropTypes.object,
    brochure: PropTypes.object,
    link: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const { getBrochureRequest, link } = this.props
    getBrochureRequest(link)
  }

  handleBrochureClose = () => {
    const { params: { viewport, types, descriptives } } = this.props
    const url = (viewport && types && descriptives) ? `/quest/${viewport}/${types}/${descriptives}/` : 'quest'
    browserHistory.push(url)
  }

  render() {
    const { brochure } = this.props
    if (!brochure) return null

    const { mainPoster, description, tiles } = brochure

    return (
      <Container fluid className="brochure">
        <Row className="brochure__row">
          { mainPoster &&
            <Col lg={8} md={12} sm={12} xs={12} className="brochure__col">
              <ImageTile type="main" img={mainPoster.url} title={mainPoster.title} />
            </Col>
          }
          { description &&
            <Col lg={4} md={12} sm={12} xs={12} className="brochure__col">
              <div className="brochure__menu">
                <button className="brochure__closeBtn" onClick={this.handleBrochureClose}>
                  <Img src={`${CLOUDINARY_ICON_URL}/close-white-shadow.png`} />
                </button>
              </div>
              <Row className="brochure__row">
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <TextTile type="description" title={''} content={description.text.content} />
                </Col>
                <Col lg={12} md={6} sm={12} xs={12} className="brochure__col">
                  <ImageTile type="description" img={description.poster.url} title={description.poster.title} />
                </Col>
              </Row>
            </Col>
          }
        </Row>
        <Row className="brochure__row">
          { tiles && tiles.map((tile, index) => {
            const { content, title, type, url } = tile
            return (type === 'text') ? <TextTile title={title} content={content} key={index} /> : <ImageTile img={url} title={title} key={index} />
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
}

export default compose(
  withRouter,
  connect(selectors, actions)
)(Brochure)
