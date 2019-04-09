import React, { Component } from 'react';
import HistoryTable from './history-table.js';
import './send-money-form.css';

class SendMoneyForm extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        receiverUsername: "",
        amountToSend: "",
        inputResult: "",
        messageTimeoutID: -1,
        transactionHistory: []
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSend = this.handleSend.bind(this);
      this.handleGetHistory = this.handleGetHistory.bind(this);
      this.checkForFormErrors = this.checkForFormErrors.bind(this);
      this.updateInputResultMessage = this.updateInputResultMessage.bind(this);
      this.closeTable = this.closeTable.bind(this);
    }

    // Close the transaction history table
    closeTable(event){
      event.preventDefault();
      this.setState({transactionHistory:[]});
    }
  
    // Update state properties based on the input fields
    handleInputChange(event) {
      const value = event.target.value;
      const name = event.target.name;
  
      this.setState({
        [name]: value
      });
    }
    
    checkForFormErrors(){
      
      if(!this.state.receiverUsername)
        return "Please enter the receiver's username."

      // Validate amount to send
      let validatedAmountToSend = parseFloat(this.state.amountToSend);
      if(isNaN(validatedAmountToSend))
        return "Please enter the amount to send.";
      else {
        if(validatedAmountToSend <= 0)
          return "Please enter more than 0 money to send.";
      }
      
      // Other possible erros (can check if username is valid in the client instead of the server)

      return "";
    }

    // Get history, update success/error message and show table
    async handleGetHistory(event){
      event.preventDefault();
      let finalResult = "";

      const response = await fetch("/api/history/" + this.props.userID);
      const responseObject = await response.json();
  
      if (response.status !== 200) throw Error(responseObject.message);
  
      if(responseObject.result === "SUCCESS"){
        finalResult = "Fetched transaction history.";
        this.setState({transactionHistory: responseObject.userTransactionHistory});
      } else {
        finalResult = "Get history failed!";
        console.log(responseObject.result);
      }

      this.updateInputResultMessage(finalResult)
    }

    // Validate and send data to server and show a message based on the results
    async handleSend(event) {
      event.preventDefault();
      let finalResult = this.checkForFormErrors();

      // If there are no validation errors, post data to the server
      if(finalResult === ""){
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userID: this.props.userID,
            receiverUsername: this.state.receiverUsername,
            amountToSend: this.state.amountToSend
          }),
        });
        
        const reponseResult = await response.json(); 
  
        if (response.status !== 200) throw Error(reponseResult.message);
  
        if(reponseResult.result === "SUCCESS"){
          finalResult = "Transaction commited successfully!";
          this.props.afterSubmit(this.state.amountToSend);
        } else {
          finalResult = "Transaction failed!";
        }
        this.setState({receiverUsername: "", amountToSend: ""})
      }

      this.updateInputResultMessage(finalResult)
    }

    // Update the submit result and hide it after 3 seconds
    updateInputResultMessage(message){
      this.setState({inputResult: message});
      if(this.state.messageTimeoutID !== -1)
        clearTimeout(this.state.messageTimeoutID);

      let messageTimeout = setTimeout(() => this.setState({inputResult: "", messageTimeoutID: -1}), 3000);
      this.setState({messageTimeoutID: messageTimeout});
    }

    render() {
      return (
        <form className="send-money-form">
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
                id="form-amount-input" name="amountToSend" type="number" step="any" className="form-field-input"
                value={this.state.amountToSend} onChange={this.handleInputChange}
              />
          </div>
            <button id="form-submit-button" className="wallet-app-button" onClick={this.handleSend}>
              Send
            </button>
            <button id="form-get-history-button" className="wallet-app-button" onClick={this.handleGetHistory}>
              Get Transaction History
            </button>
          <div className={"input-result" + (this.state.inputResult === "" ? " hidden" : "")}>
            {this.state.inputResult}
          </div>
          <HistoryTable 
            data={this.state.transactionHistory} 
            currency={this.props.currency} 
            hidden={this.state.transactionHistory.length === 0}
            closeTable={this.closeTable}
          />
        </form>
      );
    }
  }

export default SendMoneyForm; 