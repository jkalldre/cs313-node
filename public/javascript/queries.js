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

queries.getTopics = function (req,res) {
    db.any('SELECT t.title as "Title", ta.title as "Tags"\n' +
           'FROM   topics t\n' +
           'INNER JOIN topic_tag_relationship r\n' +
           'ON t.topic_id = r.topic_id\n' +
           'INNER JOIN tags ta\n' +
           'ON ta.tag_id = r.tag_id;',[])
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