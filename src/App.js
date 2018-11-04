import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './components/NavBar';
import Map from './containers/Map';
import SideBar from './components/SideBar';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <SideBar />
        <Map />
        <Footer />
      </div>
    );
  }
}

export default App;
