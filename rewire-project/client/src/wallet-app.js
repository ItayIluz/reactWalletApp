import React, { Component } from 'react';
import SendMoneyForm from './send-money-form.js';
import './wallet-app.css';

class WalletApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: "Itay Iluz",
      currentBalance: 0,
    }
  }

  componentDidMount() {
    fetch("/api/hello")
      .then(
        result => result.json().then(res => console.log(res)),
        error => alert("ERROR: ", error)
      )
  }

  render() {
    return (
      <div className="wallet-app">
        <header className="wallet-app-header">
          Wallet App - Hello {this.state.username}
        </header>
        <div className="wallet-app-container">
          <SendMoneyForm />
        </div>
      </div>
    );
  }
}

export default WalletApp; 
