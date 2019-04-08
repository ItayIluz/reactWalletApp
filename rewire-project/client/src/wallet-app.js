import React, { Component } from 'react';
import SendMoneyForm from './send-money-form.js';
import './wallet-app.css';

class WalletApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      userID: 1,
      name: "Itay Iluz",
      currentBalance: 0,
      currency: "₪",
    }
  }

  componentDidMount() {
    fetch("/api/balance/" + this.state.userID)
      .then(
        result => result.json().then(resultObject => this.setState({currentBalance: resultObject.balance})),
        error => console.log(error)
      );

      fetch('/api/world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post: "test" }),
      }).then(result => console.log(result.json().then(result=>console.log(result))));
  }

  render() {
    return (
      <div className="wallet-app">
        <div className="wallet-app-header">
          Wallet App
        </div>
        <div className="container user-data">
          <div>Hello {this.state.name}!</div>
          <div>Your current balance is: <span className="current-balance">{this.state.currentBalance}{this.state.currency}</span></div>
        </div>
        <div className="container form-container">
          <SendMoneyForm 
          currency={this.state.currency}/>
        </div>
      </div>
    );
  }
}

export default WalletApp; 
