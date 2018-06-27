const db = require('./connectDB.js');
var queries = {};
queries.getUsers = function (req,res) {
  db.any('SELECT * FROM users',[])
      .then((results) => {
          console.log(results);
          res.status(200)
              .json(results);
      })
      .catch((err) => {
          console.log(err);
          res.status(400)
              .json({"error" : "Invalid request"})
          console.log("error in query")
      });
};

module.exports = queries;