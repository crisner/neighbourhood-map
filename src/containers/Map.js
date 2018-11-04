import React, {Component} from 'react';
import ReactMapGL, {NavigationControl} from 'react-map-gl';

// mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}

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
      <ReactMapGL
        mapStyle="mapbox://styles/crisner/cjo2rsbau30eo2sns60vykal6"
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}>
        <div style={{position: 'absolute', right: 0, top: '75px'}}>
          <NavigationControl onViewportChange={(viewport) => this.setState({viewport})} />
        </div>
      </ReactMapGL>
    );
  }
}

export default Map;