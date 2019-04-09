const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: "remotemysql.com",
      database: "pcam5R13Uq",
      user: "pcam5R13Uq",
      password: "dxdIdkEHVO"
    });
    
    this.isConnected = false;
    this.connection.connect(error => {
      if (error) {
        console.log(error); // Handle connection error
      }else {
        this.isConnected = true;
        console.log("Connected to MySQL Database!");
      }
    });
  }
  query(sql, params) {
    if(this.isConnected){
      return new Promise((resolve, reject) => {
        this.connection.query(sql, params, (error, rows, columns) => {
            if (error)
              reject(Error("ERROR " + error));
            resolve({result: "SUCCESS", rows: rows, columns: columns});
        });
      });
    } else {
      console.log("Error! There was a problem connecting to the MySQL database."); // Handle connection error
      return null;
    }
  }
  close() {
    if(this.isConnected){
      return new Promise((resolve, reject) => {
        this.connection.end(error => {
            if (error)
              reject(Error("ERROR " + error));
            resolve("SUCCESS");
        });
      });
    } else {
      console.log("Error! There was a problem connecting to the MySQL database."); // Handle connection error
      return null;
    }
  }
}

const database = new Database();

app.get('/api/balance/:id', (req, res) => {
  database.query("SELECT balance FROM `user_details` WHERE id=?", req.params.id)
    .then(resultObject => res.send({ balance: resultObject.rows[0].balance }));
});

  app.post('/api/send', (req, res) => {
    let amountToSend = parseFloat(req.body.amountToSend),
        receiverUsername = req.body.receiverUsername,
        senderID = req.body.senderID;

    database.query("UPDATE `user_details` SET balance=(balance+?) WHERE username=?", [amountToSend, receiverUsername])
      .then(resultObject => {
        if(resultObject.rows.affectedRows > 0)
          database.query("UPDATE `user_details` SET balance=(balance-?) WHERE id=?", [amountToSend, senderID])
        else 
          throw Error("ERROR unknown username.");
      })
      .then(() => database.query("INSERT INTO `transaction_history` (from_user_id, to_user_id, amount,transaction_datetime) VALUES" +
                                "(?,(SELECT id FROM `user_details` WHERE username=?),?, NOW())",  [senderID, receiverUsername, amountToSend]))
      .then(resultObject => res.send({result: resultObject.result})) 
      .catch(error => res.send({result: error.message}));
  });

  app.get('/api/history/:id', (req, res) => {

    database.query("SELECT `user_details`.name, amount, transaction_datetime" + 
              "FROM `transaction_history` LEFT JOIN `user_details` ON (`user_details`.id = `transaction_history`.`to_user_id`)" + 
              "WHERE from_user_id=?", req.params.id)
      .then(resultObject => res.send({ result: resultObject.result, userTransactionHistory: resultObject.rows }), 
            resultObject => res.send({ result: resultObject.result}));
  });

app.listen(port, () => console.log(`Listening on port ${port}`));