import React, { Component } from 'react';
import './send-money-form.css';

class SendMoneyForm extends Component {
    constructor(props) {
      super(props);

      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleSubmit(event) {
      event.preventDefault();
    }
     
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="form-field-title">
            Fill this form to send money:
          </div>
          <div className="form-field-container">
            <label htmlFor="form-receiver-input">Receiver:</label>
              <input id="form-receiver-input" type="text" className="form-field-input"/>
          </div>
          <div className="form-field-container">
            <label htmlFor="form-amount-input">Amount (in {this.props.currency}):</label>
              <input id="form-amount-input" type="text" className="form-field-input"/>
          </div>
            <input className="form-submit-button" type="submit" value="Submit" />
        </form>
      );
    }
  }

export default SendMoneyForm; 