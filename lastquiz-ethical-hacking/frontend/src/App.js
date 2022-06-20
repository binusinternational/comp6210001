import Form from './components/Form';

import React from 'react';

import axios from 'axios';
import jwt_decode from "jwt-decode";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      token: null,
      isWrongLogin: false,
      randomTextFromBackend: null,
      isWaiting: false,
      };
    this.onLoggedOut = this.onLoggedOut.bind(this);
    this.onLoadText = this.onLoadText.bind(this);
  }  

  handleCallback = (username,passwd) =>{
    this.setState({
      isWaiting: true,
    });
    let that = this;
    axios.post(
       'http://localhost:8000/api/v1/token',
       `grant_type=&username=${username}&password=${passwd}&scope=&client_id=&client_secret=`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
		    },
        { validateStatus: false }
    )
    .then((response) => {
        localStorage.setItem('token-lastquiz-eh', response['data']['access_token']);
        this.setState({ 
          token: response['data']['access_token'],
          isLoggedIn: true,
          isWrongLogin: false,
          isWaiting: false,
          });
    })
    .catch(function(error) {
        if (error) {
          console.log('Login error')
        }
        that.setState({
          isWrongLogin: true,
          isWaiting: false,
        });
    }); 
  }

  onLoggedOut(){
    this.setState({
      isLoggedIn: false,
      isWrongLogin: false,
    });
    localStorage.removeItem('token-lastquiz-eh');
  }

  componentDidMount(){
    const keys = Object.keys(localStorage)
    if(keys){
      if (keys.includes('token-lastquiz-eh')){
        const token = localStorage.getItem('token-lastquiz-eh')
        if(jwt_decode(token).exp < Math.floor(Date.now() / 1000)){
          this.setState({
            isLoggedIn: false,
            isWrongLogin: false,
          });
        }
        else{
          this.setState({
            isLoggedIn: true,
          });
        }
      }
    }
  }

  onLoadText(){
    this.setState({
      isWaiting: true,
    });
    const token = localStorage.getItem('token-lastquiz-eh')
    let that = this
    axios.get('http://localhost:8000/api/v1/number', 
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
        }})
        .then((response) => {
          this.setState({
            randomTextFromBackend: response['data']['data'],
            isWaiting: false,
          })
        })
        .catch(function(error) {
            if (error) {
              console.log('Auth error')
            }
            that.setState({
              isLoggedIn: false,
              isWrongLogin: false,
              isWaiting: false,
            });
        }); 
  }

  render() {
    return (
      <div>
        { this.state.isWrongLogin ? <h1>Wrong credential!</h1> : null }
        { this.state.isLoggedIn ? null : <Form parentCallback = {this.handleCallback} /> }
        { this.state.isLoggedIn ? <button onClick={this.onLoggedOut}> Log Out </button> : null }
        { this.state.isLoggedIn ? <button onClick={this.onLoadText}> Get your number </button> : null }
        { this.state.isWaiting ? <h1>Please wait!</h1> : null }
        { this.state.isLoggedIn && this.state.randomTextFromBackend ? <h2>Your number is: {this.state.randomTextFromBackend} (this is not a flag)</h2> : null }
      </div>
    );
  }
}

export default App;
