console.log("queries.js included.");

const db = require('./connectDB.js');
const url = require('url');

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
              .json({"error" : "Invalid request"});
          console.log("error in query");
      });
};

queries.getTopics = function (req,res) {
    db.any('SELECT t.topic_id as "ID", t.title as "Title", u.username as "User" \n'+
           'FROM   topics t\n'+
           'INNER JOIN users u\n'+
           'ON t.user_id = u.user_id',[])
    // db.any('SELECT t.topic_id as "ID", t.title as "Title", ta.title as "Tags"\n' +
    //        'FROM   topics t\n' +
    //        'INNER JOIN topic_tag_relationship r\n' +
    //        'ON t.topic_id = r.topic_id\n' +
    //        'INNER JOIN tags ta\n' +
    //        'ON ta.tag_id = r.tag_id;',[])
        .then((results) => {
            console.log(results);
            res.status(200)
                .json(results);
        })
        .catch((err) => {
            console.log(err);
            res.status(400)
                .json({"error" : "Invalid request"});
            console.log("error in query")
        });

};

queries.getComments = function (req,res) {
    var id = url.parse(req.url,true).query.id;
    console.log(id);
    db.any('SELECT t.title as "Title", c.content As "Content", u.username as "tCreator",\n'+
           't.topic_id as "tID", u1.username as "cCreator"\n'+
           'FROM   comments c\n'+
           'INNER JOIN topics t\n'+
           'ON t.topic_id = c.topic_id\n'+
           'INNER JOIN users u\n'+
           'ON t.user_id = u.user_id\n'+
           'INNER JOIN users u1\n'+
           'ON c.user_id = u1.user_id\n'+
           'WHERE  c.topic_id = $1\n'+
           'ORDER BY c.comment_id',[id])
        .then((results) => {
            console.log(results);
            res.status(200)
                .json(results);
        })
        .catch((err) => {
            console.log(err);
            res.status(400)
                .json({"error" : "Invalid request"});
            console.log("error in query")
        });
};

queries.username = function (req,res) {
    var id = url.parse(req.url,true).query.id;
    console.log(id);
    db.one('SELECT username\n'+
            'FROM users\n'+
            'WHERE user_id = $1',[id])
        .then(results => {
            res.status(200)
                .json(results);
        })
        .catch(err => console.log(err));
};

module.exports = queries;