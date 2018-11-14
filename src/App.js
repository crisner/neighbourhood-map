import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'
import 'mapbox-gl/dist/mapbox-gl.css';
import NavBar from './containers/NavBar';
import Map from './containers/Map';
import Footer from './components/Footer';
import Modal from './components/Modal';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import './App.css';

class App extends Component {

    state = {
        location_details: [],
        restaurant_details: [],
        popupInfo: null,
        query: '',
        error: false,
        errorText: '',
        modalOpen: false,
        marker: null
    }

    /*
     *  Highlight active marker
     */
    highlightMarker = (marker) => {
        this.setState({marker});
    }

    /*
     *   API Call to get all restaurant locations
     */
    getAllLocations = () => {
        const Url = 'https://developers.zomato.com/api/v2.1/search?entity_id=30&entity_type=city&lat=11.0168&lon=76.9558&establishment_type=16&category=1%2C2%2C5&sort=rating&order=desc&start=0';
        const headers = new Headers({
            "Content-Type": "application/json",
            "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
        });
        return fetch(Url, {headers}).then(res => {
            if(!res.ok) {
                return Promise.reject({
                    status: res.status,
                    statusText: res.statusText
                })
            } else {
                return res.json();
            }
        });
    }

    /*
     *   API Call to get restaurant details
     */
    getRestaurantDetails = (resId) => {
        const Url = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${resId}`;
        const headers = new Headers({
            "Content-Type": "application/json",
            "user-key": process.env.REACT_APP_ZOMATO_ACCESS_TOKEN
        });
        return fetch(Url, {headers}).then(res => {
            if(!res.ok) {
                return Promise.reject({
                    status: res.status,
                    statusText: res.statusText
                })
            } else {
                return res.json();
            }
        });
    }

    /*
     *   Function to get restaurant data
     *   from the api
     */
    setRestaurantInfo(resId) {
        this.getRestaurantDetails(resId)
        .then(details => {
            this.setState({restaurant_details: details})
        })
        .catch(error => {
            this.setState({restaurant_details: error})
            console.log(error, 'Cannot find restaurant details')
        })
    }

    /*
     *   Function to update restaurant data
     */
    updateResInfoClickHandler = (coords) => {
        if(this.state.popupInfo === coords) {
            this.setState({
                popupInfo: null,
                restaurant_details: []
            })
        } else {
            this.setState({
                popupInfo: coords,
                restaurant_details: []
            })
        }
    }

    /*
     *   Update search query
     */
    updateQuery = (query) => {
        this.setState({ query: query.trim() });
    }

    /*
     *   Close popup box
     */
    closeOnClick = () => {
        this.setState({popupInfo: null})
    }

    /*
     *   Function to display rating
     *   with star icons
     */
    displayStarRating = (rating) => {
        const FullRating = 5;
        let ratingScore = rating;
        let starRating = [];
        for(let i = 0; i < FullRating; i++) { // Put type of star in the array
          if(ratingScore > 1) {
            starRating.push(1);
          } else if(ratingScore > 0 && ratingScore < 1) {
            starRating.push(0.5);
          } else {
            starRating.push(0);
          }
          ratingScore--;
        }
        return starRating.map((star, index) => { // Display star with icons depending upon type
          return (
            star === 1 ? <StarIcon key={index} /> : (star === 0.5 ? <StarHalfIcon key={index} /> : <StarBorderIcon key={index} />)
          )
        });
    }

    /*
     *   Handlers for modal
     */
    handleOpen = () => {
        this.setState({ modalOpen: true });
    };

    handleClose = () => {
        this.setState({
            modalOpen: false,
            error: false,
            errorText: ''
         });
    };

    /*
     *   Display modal
     */
    showModal = () => {
        return this.state.error && (
            <Modal open={this.state.error}
             text={this.state.errorText}
             handleClose={this.handleClose.bind(this)} />
        )
    }

    /*
     *   Get height for map component
     */
    reduceHeight = () => {
        const totalHeight = window.innerHeight;
        const navHeight = document.querySelector('header').clientHeight;
        const footerHeight = document.querySelector('footer').clientHeight;
        const mapHeight = totalHeight - (navHeight + footerHeight);
        return mapHeight;
    }

    /*
     *   Get position for map component
     */
    setPosition = () => {
        const navHeight = document.querySelector('header').clientHeight;
        return navHeight;
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
        })
        .catch(error => {
            this.handleOpen();
            this.setState({
                location_details: error,
                error: true,
                errorText: 'Unable to retrieve restaurant locations'
            })
            console.log(error)
        })
    }

    render() {

        let showLocList;
        if(this.state.query) { // Display filtered list
            const match = new RegExp(escapeRegExp(this.state.query), 'i')
            showLocList = this.state.location_details
            .filter(location => match.test(location.name))
        } else {
            showLocList = this.state.location_details;
        }

        return (
        <div className="App">
            <NavBar
            marker={this.highlightMarker.bind(this)}
            location={showLocList}
            query={this.state.query}
            updateQuery={this.updateQuery.bind(this)}
            clickInfo={this.updateResInfoClickHandler.bind(this)} />
            <Map
            markerId={this.state.marker}
            marker={this.highlightMarker.bind(this)}
            topPosition={this.setPosition}
            height={this.reduceHeight}
            error={this.state.error}
            location={showLocList}
            details={this.state.restaurant_details}
            popupInfo={this.state.popupInfo}
            displayStarRating={this.displayStarRating}
            closeOnClick={this.closeOnClick.bind(this)}
            clickInfo={this.updateResInfoClickHandler.bind(this)}
            setRestaurantInfo={this.setRestaurantInfo.bind(this)} />
            <Footer />
            {this.showModal()}
        </div>
        );
    }
}

export default App;
