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
  password: "dxdIdkEHVO"
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

app.get('/api/balance/:id', (req, res) => {

  if(dbConnected){
   con.query("SELECT balance FROM `user_details` WHERE id=?", req.params.id, (error, results, fields) => {
      if(error) {
        console.log(error);
      } else {
         res.send({ balance: results[0].balance });
      }
    });
  }

});

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    {a:"a", b:"c", "c":true}
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));