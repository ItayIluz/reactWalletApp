import React, { Component } from 'react';
import './send-money-form.css';

class SendMoneyForm extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        receiverUsername: "",
        amountToSend: "",
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleInputChange(event) {
      const value = event.target.value;
      const name = event.target.name;
  
      this.setState({
        [name]: value
      });
    }

    handleSubmit(event) {
      event.preventDefault();

      fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          senderID: this.props.senderID,
          receiverUsername: this.state.receiverUsername,
          amountToSend: this.state.amountToSend
        }),
      }).then(result => {
          console.log(result.json().then(result=>console.log(result)));
      });
    }
     
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-field-title">
            Fill this form to send money:
          </div>
          <div className="form-field-container">
            <label htmlFor="form-receiver-input">Receiver Username:</label>
              <input 
                id="form-receiver-input" name="receiverUsername" type="text" className="form-field-input" 
                value={this.state.receiverUsername} onChange={this.handleInputChange}
              />
          </div>
          <div className="form-field-container">
            <label htmlFor="form-amount-input">Amount (in {this.props.currency}):</label>
              <input 
                id="form-amount-input" name="amountToSend" type="text" className="form-field-input"
                value={this.state.amountToSend} onChange={this.handleInputChange}
              />
          </div>
            <input 
              id="form-submit-button" className="form-submit-button" type="submit" value="Submit"
              onSubmit={this.handleSubmit}
            />
        </form>
      );
    }
  }

export default SendMoneyForm; 