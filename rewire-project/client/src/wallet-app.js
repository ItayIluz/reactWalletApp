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
      hidePopupDialog: true
    }

    this.updateUserBalance = this.updateUserBalance.bind(this);
  }

  componentDidMount() {
    this.getUserBalance()
      .then(
        resultObject => this.setState({currentBalance: resultObject.balance}),
        error => console.log(error)
      );
  }

  async getUserBalance(){
    const response = await fetch("/api/balance/" + this.state.userID);
    const responseObject = await response.json();

    if (response.status !== 200) throw Error(responseObject.message);

    return responseObject;
  }

  updateUserBalance(toSubtract){
    this.setState({currentBalance: this.state.currentBalance - toSubtract});
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
            currency={this.state.currency}
            senderID={this.state.userID}
            afterSubmit={this.updateUserBalance}
          />
        </div>
      </div>
    );
  }
}

export default WalletApp; 
