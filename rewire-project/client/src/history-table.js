import React, { Component } from 'react';
import './history-table.css';

class HistoryTable extends Component {

    formatDatetime(dateTime){
      dateTime = dateTime.split("T");
      let date = dateTime[0].split("-"),
        yyyy = date[0],
        mm = date[1],
        dd = date[2],
        time = dateTime[1].split(":"),
        h = time[0],
        m = time[1];
      return dd + '-' + mm + '-' + yyyy + " " + h + ":" + m;
    }

    createTable() {
      let table = []
      let dataArray = this.props.data;
      
      for (let i = 0; i < dataArray.length; i++) {
          let children = []
        
          children.push(<td key={dataArray[i].id+"-"+i+"name"}>{dataArray[i].name}</td>)
          children.push(<td key={dataArray[i].id+"-"+i+"amount"}>{dataArray[i].amount}{this.props.currency}</td>)
          children.push(<td key={dataArray[i].id+"-"+i+"datetime"}>{this.formatDatetime(dataArray[i].datetime)}</td>)
        
          table.push(<tr key={dataArray[i].id} data-id={dataArray[i].id}>{children}</tr>)
      }
      return table
    }

    render() {
      return (
        <div className={"table-container" + (this.props.hidden ? " hidden" : "")}>
          <table className="history-table">
            <thead>
              <tr>
                <th>To</th>
                <th>Amount</th>
                <th>Datetime</th>
              </tr>
            </thead>
            <tbody>
              {this.createTable()}
            </tbody>
          </table>
          <button className="wallet-app-button" onClick={this.props.closeTable}>Close</button>
        </div>
      );
    }
  }

export default HistoryTable; 