const pg = require('pg-promise')({});
const PORT = process.env.PORT || 5000;
const conString = `postgres://localhost:${PORT}/forumDB`; //replace for heroku
const db = pg(conString);
