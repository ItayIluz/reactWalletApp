const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
  host: "remotemysql.com",
  database: "pcam5R13Uq",
  user: "pcam5R13Uq",
  password: "dxdIdkEHVO",
  multipleStatements: true
});

let dbConnected = false;

con.connect(function(error) {
  if (error) {
    console.log(error);
  }else {
    dbConnected = true;
    console.log("Connected to MySQL Database!");
  }
});

function queryDBIfConnected(connectedCallback){
  if(dbConnected)
    connectedCallback();
  else
  console.log("Error! There was a problem connecting to the MySQL database."); // Handle connection error
}

app.get('/api/balance/:id', (req, res) => {

  queryDBIfConnected(() => {
   con.query("SELECT balance FROM `user_details` WHERE id=?", req.params.id, (error, results) => {
      if(error) {
        console.log(error);
      } else {
         res.send({ balance: results[0].balance });
      }
    });
  });
});

  app.post('/api/send', (req, res) => {
    let amountToSend = parseFloat(req.body.amountToSend),
    receiverUsername = req.body.receiverUsername,
    senderID = req.body.senderID;

    queryDBIfConnected(() => {
      
      con.query("UPDATE `user_details` SET balance=(balance+?) WHERE username=?;" +
                "UPDATE `user_details` SET balance=(balance-?) WHERE id=?;" +
                "INSERT INTO `transaction_history` (from_user_id, to_user_id, amount,transaction_datetime) VALUES" +
                "(?,(SELECT id FROM `user_details` WHERE username=?),?, NOW())", 
      [amountToSend, receiverUsername, 
      amountToSend, senderID,
        senderID, receiverUsername, amountToSend],
      error => {
        let resultToSend = { result: ""};
        if(error) {
          resultToSend.result = "ERROR " + error;
        } else {
            resultToSend.result = "SUCCESS";
        }
        res.send(resultToSend);
      });
    });
  });

  app.get('/api/history/:id', (req, res) => {

    queryDBIfConnected(() => {
     con.query("SELECT `user_details`.name, amount, transaction_datetime" + 
              "FROM `transaction_history` LEFT JOIN `user_details` ON (`user_details`.id = `transaction_history`.`to_user_id`)" + 
              "WHERE from_user_id=?", req.params.id, 
        (error, results) => {
        if(error) {
          console.log(error);
        } else {
           res.send({ userTransactionHistory: results });
        }
      });
    });
  });

app.listen(port, () => console.log(`Listening on port ${port}`));