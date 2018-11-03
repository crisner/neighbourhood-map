import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        {/* <Sidebar />
        <Map /> */}
        <Footer />
      </div>
    );
  }
}

export default App;
