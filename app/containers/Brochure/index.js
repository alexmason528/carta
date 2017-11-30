import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import cx from 'classnames'
import { Container, Row, Col } from 'reactstrap'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { fetchBrochure } from 'containers/QuestPage/actions'
import { selectBrochure } from 'containers/QuestPage/selectors'
import Img from 'components/Img'
import { ImageTile, TextTile } from 'components/Tiles'
import './style.scss'

class Brochure extends Component {

  componentDidMount() {
    const { fetchBrochure, name } = this.props
    fetchBrochure(name)
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

Brochure.propTypes = {
  fetchBrochure: PropTypes.func,
  brochure: PropTypes.object,
  name: PropTypes.string.isRequired,
}

const selectors = createStructuredSelector({
  brochure: selectBrochure(),
})

const actions = {
  fetchBrochure,
}

export default connect(selectors, actions)(Brochure)
