import React, {Component} from 'react';
import ReactMapGL from 'react-map-gl';

class Map extends Component {

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 11.004556,
      longitude: 76.961632,
      zoom: 11
    }
  };

  render() {
    return (
      <ReactMapGL mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}

export default Map;