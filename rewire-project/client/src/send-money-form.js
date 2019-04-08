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
            Enter recipient and amount
          </div>
          <div className="form-field-container">
            <label>
              Receiver:
              <input type="text" className="form-field-input"/>
            </label>
          </div>
          <div className="form-field-container">
            <label>
              Amount:
              <input type="text" className="form-field-input"/>
            </label>
          </div>
          <div className="form-field-container">
            <input type="submit" value="Submit" />
          </div>
        </form>
      );
    }
  }

export default SendMoneyForm; 