/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ReactMapboxGl, { Marker, ZoomControl } from 'react-mapbox-gl';

import { toggleCategory, fetchRecommendations } from './actions';
import { makeSelectProperties, makeSelectRecommendations } from './selectors';


import { MAP_ACCESS_TOKEN } from './constants';

import { SearchBlock, MapBlock, ScoreBoardBlock } from './Block';
import Button from './Button';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentWillMount() {
    this.mapStyle = 'mapbox://styles/mapbox/satellite-v9';

    this.containerStyle = {
      width: '100%',
      height: '100%',
    };

    this.zoom = [2];
  }

  componentDidMount() {
  }

  render() {
    const icons = ['blue', 'red', 'green', 'orange', 'yellow'];

    return (
      <div>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'Carta' },
          ]}
        />
        <div>
          <SearchBlock>
            {
              this.props.properties.map((property, index) =>
                <Button
                  active={property.get('value')}
                  key={index}
                  onClick={() => {
                    this.props.onToggleCategory(property.get('category'));
                    this.props.fetchRecommendations();
                  }}
                >
                  {property.get('category')}
                </Button>
              )
            }
          </SearchBlock>
          <MapBlock>
            <ReactMapboxGl
              style={this.mapStyle}
              accessToken={MAP_ACCESS_TOKEN}
              containerStyle={this.containerStyle}
              zoom={this.zoom}
            >
              <ZoomControl position="bottomRight" />
              {
                this.props.recommendations.get('details').map((recommendation, index) =>
                  <Marker
                    key={index}
                    coordinates={recommendation.get('coordinates').toArray()}
                    anchor="bottom"
                  >
                    <img src={`https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${icons[index]}.png`} role="presentation" />
                  </Marker>
                )
              }
            </ReactMapboxGl>
          </MapBlock>
          <ScoreBoardBlock>
            {
              this.props.recommendations.get('details').map((recommendation, index) =>
                <div key={index}>{recommendation.get('name')} : {recommendation.get('score')}</div>
              )
            }
          </ScoreBoardBlock>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  onToggleCategory: React.PropTypes.func,
  properties: React.PropTypes.object,
  recommendations: React.PropTypes.object,
  fetchRecommendations: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onToggleCategory: (category) => dispatch(toggleCategory(category)),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
  };
}

const mapStateToProps = createStructuredSelector({
  properties: makeSelectProperties(),
  recommendations: makeSelectRecommendations(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
