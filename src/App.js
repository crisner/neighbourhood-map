import React, { Component } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './components/NavBar';
import Map from './containers/Map';
import Footer from './components/Footer';
import './App.css';

class App extends Component {

    state = {
        location_details: [],
        restaurant_details: [],
        restaurant_reviews: []
    }

getAllLocations = () => {
    const Url = 'https://developers.zomato.com/api/v2.1/search?entity_id=30&entity_type=city&lat=11.0168&lon=76.9558&establishment_type=16&category=1%2C2%2C5&sort=rating&order=desc&start=0';
    const headers = new Headers({
        "Content-Type": "application/json",
        "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
    });
    return fetch(Url, {headers}).then(res => res.json());
}

getRestasurantDetails = (resId) => {
    const Url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`;
    const headers = new Headers({
        "Content-Type": "application/json",
        "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
    });
    return fetch(Url, {headers}).then(res => res.json());
}

getReviews = (resId) => {
    const Url = `https://developers.zomato.com/api/v2.1/reviews?res_id=${resId}`;
    const headers = new Headers({
        "Content-Type": "application/json",
        "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
    });
    return fetch(Url, {headers}).then(res => res.json());
}

componentDidMount() {
    this.getAllLocations()
    .then(data => {
        this.setState(() => ({
            location_details: data.restaurants.map(info => {
                return {
                    res_id: info.restaurant.R.res_id,
                    name: info.restaurant.name,
                    latitude: info.restaurant.location.latitude,
                    longitude: info.restaurant.location.longitude
                }
            })
        }))
        console.log(this.state);
    })
    .catch(error => console.log(error))
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
