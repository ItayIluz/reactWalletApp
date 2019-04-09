const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// A database object used for easier handling of concurrent queries 
class Database {
  constructor() {
    // Initialize conncetion
    this.connection = mysql.createConnection({
      host: "remotemysql.com",
      database: "pcam5R13Uq",
      user: "pcam5R13Uq",
      password: "dxdIdkEHVO"
    });
    
    // Connect
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

  // Wrap MySQL queries with promise
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

  // Close database connection
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

// Get data
app.get('/api/balance/:id', (req, res) => {
  database.query("SELECT balance FROM `user_details` WHERE id=?", req.params.id)
    .then(resultObject => res.send({ balance: resultObject.rows[0].balance }));
});

// Send money to another user
app.post('/api/send', (req, res) => {
  let amountToSend = parseFloat(req.body.amountToSend),
      receiverUsername = req.body.receiverUsername,
      userID = req.body.userID;

  // Check and add money to receiving user
  database.query("UPDATE `user_details` SET balance=(balance+?) WHERE username=?", [amountToSend, receiverUsername])
    .then(resultObject => {
      if(resultObject.rows.affectedRows > 0)
        database.query("UPDATE `user_details` SET balance=(balance-?) WHERE id=?", [amountToSend, userID]) // Subtract from sending user
      else 
        throw Error("ERROR unknown username.");
    })
    // Insert transaction details to history
    .then(() => database.query("INSERT INTO `transaction_history` (from_user_id, to_user_id, amount,transaction_datetime) VALUES" +
                              "(?,(SELECT id FROM `user_details` WHERE username=?),?, NOW())",  [userID, receiverUsername, amountToSend]))
    .then(resultObject => res.send({result: resultObject.result})) 
    .catch(error => res.send({result: error.message}));
});

// Get user's transaction history
app.get('/api/history/:id', (req, res) => {

  database.query("SELECT `transaction_history`.id, `user_details`.name, amount, transaction_datetime AS datetime " + 
            "FROM `transaction_history` LEFT JOIN `user_details` ON (`user_details`.id = `transaction_history`.`to_user_id`) " + 
            "WHERE from_user_id=? ORDER BY transaction_datetime DESC", req.params.id)
    .then(resultObject => res.send({ result: resultObject.result, userTransactionHistory: resultObject.rows }), 
          resultObject => res.send({ result: resultObject.result}));
});

app.listen(port, () => console.log(`Listening on port ${port}`));