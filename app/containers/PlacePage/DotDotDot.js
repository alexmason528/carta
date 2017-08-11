import React from 'react';
import Helmet from 'react-helmet';
import ReactDOM from 'react-dom';
import $ from 'jQuery';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchPlace } from './actions';
import { makeSelectPlace } from './selectors';

import './style.scss';

class DotDotDot extends React.Component {

  componentDidMount() {
    const $this = $(ReactDOM.findDOMNode(this));
    this.reDraw($this);

    let $arrow = $this.parent().find('.arrow');

    $arrow.click(() => {
      if ($arrow.hasClass('more')) {
        $arrow.addClass('less').removeClass('more');
        $arrow.closest('.col').addClass('opened');
      } else if ($arrow.hasClass('less')) {
        $arrow.removeClass('less').addClass('more');
        $arrow.closest('.col').removeClass('opened');
        let dot = $arrow.prev();

        const height = dot.css('height');
        const fontSize = parseFloat(dot.css('font-size'), 10);
        const lineClamp = parseInt(height / (fontSize * 1.5), 10);

        dot.css('WebkitLineClamp', lineClamp.toString());

        let outerHeight = dot.outerHeight();
        let innerHeight = dot.find('span').outerHeight();

        if (outerHeight < innerHeight) {
          $arrow.css('display', 'block');
        } else {
          $arrow.css('display', 'none');
        }
      }
    });

    $this.closest('.col').click((evt) => {
      if ($arrow.hasClass('less')) evt.stopPropagation();
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getMaxZIndex = () => {
    let maxZ = 0;
    $('body').find('.col').each((ind, col) => {
      const current = parseInt($(col).css('z-index'), 10);
      if (current > maxZ) {
        maxZ = current;
      }
    });
    return maxZ;
  }

  handleResize = () => {
    const $this = $(ReactDOM.findDOMNode(this));
    this.reDraw($this);
  }

  reDraw = (dot) => {
    let $arrow = dot.parent().find('.arrow');
    if ($arrow.hasClass('less')) return;

    let headingHeight = 0;

    if (dot.parent().find('h2').length > 0) {
      headingHeight = dot.parent().find('h2').height() + 8;
    }

    dot.css('height', `calc(100% - ${headingHeight}px)`);

    const height = dot.height();
    const fontSize = parseFloat(dot.css('font-size'), 10);
    const lineClamp = parseInt(height / (fontSize * 1.5), 10);

    dot.css('height', `${(lineClamp * fontSize * 1.5) - 7}px`);
    dot.css('WebkitLineClamp', lineClamp.toString());

    let outerHeight = dot.outerHeight();
    let innerHeight = dot.find('span').outerHeight();

    if (outerHeight < innerHeight) {
      $arrow.css('display', 'block');
    } else {
      $arrow.css('display', 'none');
    }

    $('body').find('.text-tile h2').each((ind, h2) => {
      const pWidth = $(h2).parent().outerWidth();
      $(h2).css('font-size', `${pWidth / 19}px`);
    });

    $('body').find('.img-tile h2').each((ind, h2) => {
      const pWidth = $(h2).parent().outerWidth();
      $(h2).css('font-size', `${pWidth / 11}px`);
    });

    const mainPosterWidth = $('body').find('.main-content .poster').outerWidth();
    $('body').find('.main-content .poster h1').css('font-size', `${mainPosterWidth / 11}px`);
  }

  render() {
    return (
      <p>
        {this.props.children}
        <span>{this.props.children}</span>
      </p>
    );
  }
}

DotDotDot.propTypes = {
  children: React.PropTypes.string,
};

export default DotDotDot;
