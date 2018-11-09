import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './components/NavBar';
import Map from './containers/Map';
import Footer from './components/Footer';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import './App.css';


class App extends Component {

    state = {
        location_details: [],
        restaurant_details: [],
        restaurant_reviews: [],
        popupInfo: null,
        query: ''
    }

    getAllLocations = () => {
        const Url = 'https://developers.zomato.com/api/v2.1/search?entity_id=30&entity_type=city&lat=11.0168&lon=76.9558&establishment_type=16&category=1%2C2%2C5&sort=rating&order=desc&start=0';
        const headers = new Headers({
            "Content-Type": "application/json",
            "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
        });
        return fetch(Url, {headers}).then(res => res.json());
    }

    getRestaurantDetails = (resId) => {
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

    setRestaurantInfo(resId) {
        console.log("1:", this.state)
        this.getRestaurantDetails(resId)
        .then(details => {
          this.setState({restaurant_details: details})
          this.getReviews(resId)
          .then(reviews => {
            this.setState({restaurant_reviews: reviews})
            console.log("2(update):", this.state)
          })
          .catch(error => console.log(error, 'Cannot find restaurant reviews'))
        }).catch(error => console.log(error, 'Cannot find restaurant details'))
    }

    updateResInfoClickHandler = (coords) => {
        this.setState({
            popupInfo: coords,
            restaurant_details: [],
            restaurant_reviews: []
        })
    }

    updateQuery = (query) => {
        this.setState({ query: query.trim() });
    }

    closeOnClick = () => {
        this.setState({popupInfo: null})
    }

    displayStarRating = (rating) => {
        const FullRating = 5;
        let ratingScore = rating;
        let starRating = [];
        for(let i = 0; i < FullRating; i++) {
          if(ratingScore > 1) {
            starRating.push(1);
          } else if(ratingScore > 0 && ratingScore < 1) {
            starRating.push(0.5);
          } else {
            starRating.push(0);
          }
          ratingScore--;
        }
        return starRating.map((star, index) => {
          return (
            star === 1 ? <StarIcon key={index} /> : (star === 0.5 ? <StarHalfIcon key={index} /> : <StarBorderIcon key={index} />)
          )
        });
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
                        longitude: info.restaurant.location.longitude,
                        locality: info.restaurant.location.locality
                    }
                })
            }))
            console.log(data);
        })
        .catch(error => console.log(error))
    }

    render() {

        let showLocList;
        if(this.state.query) {
            const match = new RegExp(escapeRegExp(this.state.query), 'i')
            showLocList = this.state.location_details
            .filter(location => match.test(location.name))
        } else {
            showLocList = this.state.location_details;
        }

        return (
        <div className="App">
            <NavBar
            location={showLocList}
            query={this.state.query}
            updateQuery={this.updateQuery.bind(this)}
            clickInfo={this.updateResInfoClickHandler.bind(this)} />
            <Map
            location={showLocList}
            details={this.state.restaurant_details}
            reviews={this.state.restaurant_reviews}
            popupInfo={this.state.popupInfo}
            displayStarRating={this.displayStarRating}
            closeOnClick={this.closeOnClick.bind(this)}
            clickInfo={this.updateResInfoClickHandler.bind(this)}
            setRestaurantInfo={this.setRestaurantInfo.bind(this)} />
            <Footer />
        </div>
        );
    }
}

export default App;
