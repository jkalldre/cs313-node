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
    db.any('SELECT t.user_id as "tID",t.topic_id as "ID", t.title as "Title", u.username as "User" \n'+
           'FROM   topics t\n'+
           'INNER JOIN users u\n'+
           'ON t.user_id = u.user_id',[])
        .then((results) => {
            // console.log(results);
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
    db.any('SELECT t.topic_id as "ID", t.title as "Title",'+
           'c.content As "Content", u.user_id as "tCreator",\n'+
           'c.user_id as "cCreator_ID",u1.username as "cCreator"\n'+
           ',c.comment_id as "cID"\n'+
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
            // console.log(results);
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

queries.userID = function (req,res) {
    var username= url.parse(req.url,true).query.username;
    // console.log(id);
    db.one('SELECT user_id\n'+
            'FROM users\n'+
            'WHERE username = $1',[username])
        .then(results => {
            res.status(200)
                .json(results);
        })
        .catch(err => console.log(err));
};

queries.getTopicCreator = function (req,res) {
    var id = url.parse(req.url,true).query.id;
    db.one('SELECT user_id\n'+
           'FROM topics\n'+
           'WHERE topic_id = $1',[id])
        .then(result => res.status(200).json(result))
        .catch(err => console.log(`Failed to get user - ${err}`));
};

queries.addTopic = function (req,res) {
  var id = url.parse(req.url,true).query.id;
  var content = url.parse(req.url,true).query.content;
  db.none('INSERT INTO topics (title, user_id) values($1,$2)',[content,id])
      .then(() => console.log("Insert: Success"))
      .catch(err => console.log(`Insert: Failed - ${err}`));
};

queries.addComment = function (req,res) {
    var id = url.parse(req.url,true).query.id;
    var topic = url.parse(req.url,true).query.topic;
    var content = url.parse(req.url,true).query.content;
    db.none('INSERT INTO comments (user_id,topic_id,content) values($1,$2,$3)',
        [id,topic,content])
        .then(() => console.log("Insert: Success"))
        .catch(err => console.log(`Insert: Failed - ${err}`));
};

queries.deleteTopic = function (req,res) {
  var id = url.parse(req.url,true).query.id;
  db.none('DELETE FROM topics WHERE topic_id = $1',[id])
      .then(() => console.log("Delete: Success"))
      .catch(err => console.log(`Delete: Failed - ${err}`));
  db.none('DELETE FROM comments WHERE topic_id = $1',[id])
      .then(() => console.log("Delete: Success"))
      .catch(err => console.log(`Delete: Failed - ${err}`));
};

queries.deleteComment = function (req,res) {
  var id = url.parse(req.url,true).query.id;
  // console.log(`Queries: ${id}`);
  db.none('DELETE FROM comments WHERE comment_id = $1',[id])
      .then(() => console.log(`Delete: Success`))
      .catch(err => console.log(`Delete: Failed - ${err}`));
};

queries.authenticate = function (req,res) {
    var username = url.parse(req.url,true).query.username;
    var password = url.parse(req.url,true).query.password;
    var dbq1 = "SELECT password FROM users WHERE username=$1";
    var dbq2 = "SELECT password = crypt($1,$2)\n"+
               "FROM users\n"+
               "WHERE username = $3";
    db.one(dbq1,[username])
        .then(result => result.password)
        .then(passhash => {
            db.one(dbq2,[password,passhash,username])
                .then(result => res.status(200).json(result))
                .catch(err => console.log(`authenticate compare error: ${err}`));
        })
        .catch(err => console.log(`authenticate error: ${err}`));

};

module.exports = queries;