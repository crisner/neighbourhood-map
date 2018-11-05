import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './components/NavBar';
import Map from './containers/Map';
import Footer from './components/Footer';
import './App.css';

class App extends Component {

    state = {
        location_details: [
            {
            "res_id": 3000048,
            "latitude": "10.9941971417",
            "longitude": "76.9633718580"
            },
            {
            "res_id": 3000195,
            "latitude": "11.0017780550",
            "longitude": "76.9760167971",
            },
            {
            "res_id": 3001572,
            "latitude": "11.0137631621",
            "longitude": "76.9468960539"
            }
        ]
    }

  render() {
    return (
      <div className="App">
        <NavBar />
        <Map location={this.state.location_details} />
        <Footer />
      </div>
    );
  }
}

export default App;
