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
    const { className } = this.props;
    const $this = $(ReactDOM.findDOMNode(this));

    const outerHeight = $this.height();
    const innerHeight = $this.prop('scrollHeight') - $this.position().top;

    if (outerHeight < innerHeight) {
      $this.find('.arrow').css('display', 'block');
      $this.addClass('overflow');
    } else {
      $this.find('.arrow').css('display', 'none');
      $this.removeClass('overflow');
    }

    $this.find('.arrow').click(() => {
      let maxZ = 0;
      $('body').find('.col').each((ind, col) => {
        const current = parseInt($(col).css('z-index'), 10);

        if (current > maxZ) {
          maxZ = current;
        }
      });
      if ($this.find('.arrow').hasClass('more')) {
        $this.find('.arrow').addClass('less').removeClass('more');
        $this.find('.arrow').closest('.text-tile').css('height', 'calc(200% + 10px)');
        $this.find('.arrow').closest('.col').css('z-index', maxZ + 1);
      } else if ($this.find('.arrow').hasClass('less')) {
        $this.find('.arrow').removeClass('less').addClass('more');
        $this.find('.arrow').closest('.text-tile').css('height', '100%');
        $this.find('.arrow').closest('.col').css('z-index', 5);
      }
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const $this = $(ReactDOM.findDOMNode(this));

    const outerHeight = $this.height();
    const innerHeight = $this.prop('scrollHeight') - $this.position().top;

    if (outerHeight < innerHeight) {
      $this.find('.arrow').css('display', 'block');
      $this.addClass('overflow');
    } else {
      $this.find('.arrow').css('display', 'none');
      $this.removeClass('overflow');
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
        <div className="arrow more"></div>
      </div>
    );
  }
}

DotDotDot.propTypes = {
  className: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
};

export default DotDotDot;
