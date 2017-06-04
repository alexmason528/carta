/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectRepos, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import H2 from 'components/H2';
import ReposList from 'components/ReposList';
import { loadRepos } from '../App/actions';
import { changeUsername, toggleCategory } from './actions';
import { makeSelectUsername, makeSelectProperties} from './selectors';

import ReactMapboxGl, { Layer, Feature, Marker, ZoomControl } from "react-mapbox-gl";
import { mapAccessToken } from './constants';

import { SearchBlock, MapBlock, ScoreBoardBlock } from './Block';
import Button from './Button';
import Input from './Input';

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */

  componentWillMount() {
    this.mapStyle = 'mapbox://styles/mapbox/satellite-v9';

    this.containerStyle = {
      width: '100%',
      height: '100%'
    };

    this.zoom = [2];
  }

  componentDidMount() {
    if (this.props.username && this.props.username.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos,
    };

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
                <Button key={index} onClick={() => this.props.onToggleCategory(property.get('category'))}>{property.get('category')}</Button>
              )
            }
          </SearchBlock>
          <MapBlock>
            <ReactMapboxGl
              style={this.mapStyle}
              accessToken={mapAccessToken}
              containerStyle={this.containerStyle}
              zoom={this.zoom}>
              <ZoomControl position="bottomRight" />
              <Marker
                coordinates={[-3.647157194966011, 40.22683199586228]}
                anchor="bottom">
                <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" />
              </Marker>
              <Marker
                coordinates={[2.55355025434387, 46.558913222390714]}
                anchor="bottom">
                <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" />
              </Marker>
              <Marker
                coordinates={[12.078198074404876, 42.78972845672251]}
                anchor="bottom">
                <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" />
              </Marker>
              <Marker
                coordinates={[-53.07658774438149, -10.743661015029495]}
                anchor="bottom">
                <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" />
              </Marker>
              <Marker
                coordinates={[-112.55642324745719, 45.711338189013595]}
                anchor="bottom">
                <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png" />
              </Marker>
            </ReactMapboxGl>
          </MapBlock>
          <ScoreBoardBlock>
            Spain : 31<br/>
            France : 24 <br/>
            Italy : 23 <br/>
            Brazil : 22 <br/>
            United States : 19 <br/>
          </ScoreBoardBlock>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  username: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
  onToggleCategory: React.PropTypes.func
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onToggleCategory: (category) => dispatch(toggleCategory(category)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
  properties: makeSelectProperties()
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
