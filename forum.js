// const { Pool } = require('pg');
// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: false
// });
const url     = require('url');
const express = require('express');
const path    = require('path');
const PORT    = process.env.PORT || 8000;
const queries = require('./public/javascript/queries.js');
const app     = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/forum',{title: "Forum"}));
app.get('/getTopics', queries.getTopics);
app.get('/userComments', (req,res) => res.render('pages/userComments',{title: "My Comments"}));
app.listen(PORT,()=> console.log(`Listening on port ${PORT}`));