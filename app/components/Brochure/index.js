import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import className from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { browserHistory } from 'react-router'
import { fetchBrochure } from 'containers/QuestPage/actions'
import { selectBrochure } from 'containers/QuestPage/selectors'

import './style.scss'

class Brochure extends Component {

  constructor(props) {
    super(props)

    this.state = {
      imageLoaded: false,
    }
  }

  componentDidMount() {
    const { fetchBrochure, name } = this.props
    fetchBrochure(name)

    $('body').delegate('.more', 'click', function moreClicked(evt) {
      evt.stopPropagation()
      let tileWidth

      if ($('.brochure-container').width() < 550) {
        tileWidth = $('.brochure-container').width()
      } else if ($('.brochure-container').width() < 1000) {
        tileWidth = $('.brochure-container').width() / 2
      } else {
        tileWidth = $('.brochure-container').width() / 3
      }

      const bottom = $('.brochure-container').height() - $(this).offset().top

      if (bottom > 50) {
        $(this).closest('.tile').css({ 'z-index': '40' })
        $(this)
        .closest('.content')
        .addClass('expanded to-below')
        .animate({ height: tileWidth * 2 }, 150, function tileOpen() { $(this).find('p').trigger('update.dot') })
      } else {
        const right = $('.brochure-container').width() - $(this).offset().left
        if (right > 50) {
          $(this).closest('.tile').css({ 'z-index': '40' })
          $(this)
          .closest('.content')
          .addClass('expanded to-right')
          .animate({ width: tileWidth * 2 }, 150, function tileOpen() { $(this).find('p').trigger('update.dot') })
        } else {
          $(this)
          .closest('.content')
          .addClass('expanded to-left')
          .animate({ width: tileWidth * 2, left: -tileWidth }, 150, function tileOpen() { $(this).find('p').trigger('update.dot') })
        }
      }

      $(this).closest('.tile').find('.less').fadeIn(150)
    })

    $('body').delegate('.less', 'click', () => {
      $('.to-below')
      .removeClass('expanded to-below')
      .animate({ height: '100%' }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.to-right')
      .removeClass('expanded to-right')
      .animate({ width: '100%' }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.to-left')
      .removeClass('expanded to-left')
      .animate({ width: '100%', left: 0 }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.less').fadeOut(150)
    })

    $('body').delegate('.expanded', 'click', (evt) => {
      evt.stopPropagation()
    })

    $('body').click(() => {
      $('.to-below')
      .removeClass('expanded to-below')
      .animate({ height: '100%' }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.to-right')
      .removeClass('expanded to-right')
      .animate({ width: '100%' }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.to-left')
      .removeClass('expanded to-left')
      .animate({ width: '100%', left: 0 }, 150, function tileClose() { $(this).find('p').trigger('update.dot') })
      $('.less').fadeOut(150)
    })

    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  AddDividers = (column, rows) => {
    $('.dividers div').remove()
    for (let i = 1; i < column; i += 1) { $('.dividers').append(`<div class='vertical-divider-s vd-${i}'></div>`) }
    for (let i = 1; i <= rows; i += 1) { $('.dividers').append(`<div class='horizontal-divider hd-${i}'></div>`) }
    for (let i = 1; i < column; i += 1) { $('.dividers').append(`<div class='vertical-divider vd-${i}'></div>`) }
  }

  handleResize = () => {
    let tileWidth
    let rows
    let cols
    let tileCount

    tileCount = $('.tile').length

    if ($('.brochure-container').width() < 550) {
      cols = 1
      tileWidth = $('.brochure-container').width() / cols
      rows = Math.ceil(tileCount - 1)

      $('.tile').css({ width: `${100 / cols}%`, height: `${tileWidth}px` })
      $('.description').css({ width: '100%', height: `${tileWidth * 2}px` })
      $('.main-poster').css({ width: `${tileWidth}px`, height: `${tileWidth}px`, 'border-right': 'none' })
      $('.main-poster h1').css({ 'font-size': `${tileWidth / 10}px` })

      this.AddDividers(cols, rows)
    } else if ($('.brochure-container').width() < 1000) {
      cols = 2
      tileWidth = $('.brochure-container').width() / cols
      rows = Math.ceil((tileCount / cols) + 0.5)

      $('.tile').css({ width: `${100 / cols}%`, height: `${tileWidth}px` })
      $('.description').css({ width: '100%', height: `${tileWidth}px` })
      $('.main-poster').css({ width: `${tileWidth * cols}px`, height: `${tileWidth * cols}px`, 'border-right': 'none' })
      $('.main-poster h1').css({ 'font-size': `${tileWidth / 5.5}px` })

      this.AddDividers(cols, rows)

      $('.vd-1').css({ left: `${tileWidth}px` })
    } else {
      cols = 3
      tileWidth = $('.brochure-container').width() / cols
      rows = Math.ceil(tileCount / cols)

      $('.tile').css({ width: `${100 / cols}%`, height: `${tileWidth}px` })
      $('.description').css({ width: '33.5%', height: `${tileWidth}px` })
      $('.main-poster').css({ width: '66.5%', height: `${tileWidth * 2}px`, 'border-right': '2px solid #fff' })
      $('.description .tile').css({ width: '100%' })
      $('.main-poster h1').css({ 'font-size': `${tileWidth / 5.5}px` })

      this.AddDividers(cols, rows)

      $('.vd-1').css({ left: `${tileWidth}px` })
      $('.vd-2').css({ left: `${tileWidth * 2}px` })
    }

    for (let i = 0; i < $('.tile').length; i += 1) {
      let firstTile = $('.tile')[i]
      if ($(firstTile).hasClass('text-tile')) {
        $(firstTile).find('.content').css({ 'padding-left': '30px' })
      } else if ($(firstTile).hasClass('image-tile')) {
        $(firstTile).find('h2').css({ 'padding-left': '30px' })
      }
    }

    if (cols === 3) {
      for (let i = 3; i < tileCount; i += 3) {
        let firstTile = $('.tile')[i]
        if ($(firstTile).hasClass('text-tile')) {
          $(firstTile).find('.content').css({ 'padding-left': '60px' })
        } else if ($(firstTile).hasClass('image-tile')) {
          $(firstTile).find('h2').css({ 'padding-left': '60px' })
        }
      }
    } else if (cols === 2) {
      for (let i = cols - 1; i < tileCount; i += 2) {
        let firstTile = $('.tile')[i]
        if ($(firstTile).hasClass('text-tile')) {
          $(firstTile).find('.content').css({ 'padding-left': '60px' })
        } else if ($(firstTile).hasClass('image-tile')) {
          $(firstTile).find('h2').css({ 'padding-left': '60px' })
        }
      }
    } else {
      for (let i = cols - 1; i < tileCount; i += 1) {
        let firstTile = $('.tile')[i]
        if ($(firstTile).hasClass('text-tile')) {
          $(firstTile).find('.content').css({ 'padding-left': '60px' })
        } else if ($(firstTile).hasClass('image-tile')) {
          $(firstTile).find('h2').css({ 'padding-left': '60px' })
        }
      }
    }

    $('.tile-placeholder').remove()
    tileCount = $('.tile').length

    if (cols === 3) {
      if (tileCount % 3 !== 0) {
        const lastTile = $('.tile')[tileCount - 1]
        const tileHeight = $(lastTile).height()
        for (let i = 0; i < (3 - (tileCount % 3)); i += 1) {
          $('.brochure-container').append(`<div class="tile text-tile tile-placeholder" style="width: 33.33%; height: ${tileHeight}px"></div>`)
        }
      }
    } else if (cols === 2) {
      if (tileCount % 2 === 0) {
        const lastTile = $('.tile')[tileCount - 1]
        const tileHeight = $(lastTile).height()
        $('.brochure-container').append(`<div class="tile text-tile tile-placeholder" style="width: 50%; height: ${tileHeight}px"></div>`)
      }
    }

    for (let i = 1; i <= rows; i += 1) {
      $(`.hd-${i}`).css({ top: `${tileWidth * i}px` })
    }

    $('p').each(function TextTileContentReplacement() {
      const heading = $(this).prev('.heading').height()
      $(this).css({ height: `calc(100% - ${heading}px)` })
    })

    $('.tile').each(function tileHeaderPosAdjust() {
      if (!$(this).hasClass('main-poster')) {
        if ($(this).hasClass('text-tile')) {
          $(this).find('h2').css({ 'font-size': `${tileWidth / 19}px` })
        } else if ($(this).hasClass('image-tile')) {
          $(this).find('h2').css({ 'font-size': `${tileWidth / 11}px` })
        } else {
          $(this).find('h1').css({ 'font-size': `${tileWidth / 8.5}px` })
        }
      }
    })
  }

  handleLoaded = () => {
    this.setState({ imageLoaded: true }, () => {
      this.handleResize()
      $('p').dotdotdot({
        watch: 'window',
        after: '.more',
        ellipsis: ' ...',
      })
    })
  }

  render() {
    const { brochure } = this.props
    if (!brochure) return null

    const { mainPoster, description, tiles } = brochure
    const { imageLoaded } = this.state
    const brochureClass = className({
      brochure: true,
      hidden: !imageLoaded,
    })

    return (
      <div className={brochureClass}>
        <Helmet
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />

        <div className="brochure-container">
          <div className="dividers"></div>
          { mainPoster &&
            <div className="tile main-poster">
              <img onLoad={this.handleLoaded} src={mainPoster.url} role="presentation" />
              <h1>{mainPoster.title}</h1>
            </div>
          }
          { description &&
            <div className="description">
              <div className="tile text-tile">
                <div className="content">
                  <p>
                    {description.text.content}
                    <a className="arrow more">
                      <em className="blue"></em>
                    </a>
                  </p>
                  <a className="arrow less">
                    <em className="blue"></em>
                  </a>
                </div>
              </div>
              <div className="tile image-tile">
                <img src={description.poster.url} role="presentation" />
                <h2>{description.poster.title}</h2>
              </div>
            </div>
          }

          { tiles && tiles.map((value, index) => {
            let tile
            const { content, title, type, url } = value
            return (value.type === 'text') ? (
              <div className="tile text-tile" key={index}>
                <div className="content">
                  <div className="heading">
                    <h2>{title}</h2>
                  </div>
                  <p>
                    {content}
                    <a className="arrow more">
                      <em className="blue"></em>
                    </a>
                  </p>
                  <a className="arrow less">
                    <em className="blue"></em>
                  </a>
                </div>
              </div>
              ) : (
                <div className="tile image-tile" key={index}>
                  <img src={url} role="presentation" />
                  <h2 dangerouslySetInnerHTML={{ __html: title }} />
                </div>
              )
          })
          }
        </div>
      </div>
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
