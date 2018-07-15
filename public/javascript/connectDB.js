require('dotenv').config();
const pg = require('pg-promise')({});
const PORT = process.env.PORT || 8000;
const conString = process.env.DATABASE_URL || `postgres://postgres:password@localhost:5432/forumdb`; //replace for heroku
const db = pg(conString);
// console.log("DATABASE_URL: " +process.env.DATABASE_URL);
module.exports = db; //export
