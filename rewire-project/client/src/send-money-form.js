import React, { Component } from 'react';
import './send-money-form.css';

class SendMoneyForm extends Component {
    constructor(props) {
      super(props);
      
      this.state = {
        receiverUsername: "",
        amountToSend: "",
        submitResult: ""
      }

      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.checkForFormErrors = this.checkForFormErrors.bind(this);
    }
  
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

    async handleSubmit(event) {
      event.preventDefault();
      let finalResult = this.checkForFormErrors();

      if(finalResult === ""){
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            senderID: this.props.senderID,
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

      this.setState({submitResult: finalResult});
    }
     
    render() {
      return (
        <form className="send-money-form" onSubmit={this.handleSubmit}>
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
            <input 
              id="form-submit-button" className="form-submit-button" type="submit" value="Submit"
              onSubmit={this.handleSubmit}
            />
          <div className={"submit-result" + (this.state.submitResult === "" ? " hidden" : "")}>
            {this.state.submitResult}
          </div>
        </form>
      );
    }
  }

export default SendMoneyForm; 