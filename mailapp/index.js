const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});
const url     = require('url');
const express = require('express')
const path    = require('path')
const PORT    = process.env.PORT || 5000
const app     = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/getRate', calculateRate);

//    .get('/cool', (req, res) => res.send(cool()))
//     .get('/db', async(req,res) => {
//         try {
//             const client = await pool.connect()
//             const result = await client.query('SELECT * FROM test_table');
//             res.render('pages/db', result);
//             client.release();
//         } catch (err) {
//             console.error(err);
//             res.send("Error " + err);
//         }
//     })
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

var flat = [0,1,1.21,1.42,1.63,1.84,2.05,2.26,2.47,2.68,2.89,3.10,3.31,3.52];
var first = [0,3.5,3.5,3.5,3.5,3.75,3.75,3.75,3.75,4.1,4.45,4.8,5.15,5.5];

function calculateRate(req,res) {
    var query = url.parse(req.url,true).query;
    var type = query.type;
    var weight = Number(query.weight);
    res.write("<h1>Postage Due:</h1>"+
              "<p>"+type+": $");
    switch (type){
        case 'Letters (Stamped)':
            res.write(""+stamp(weight).toFixed(2));
            break;
        case 'Letters (Metered)':
            res.write(""+metered(weight).toFixed(2));
            break;
        case 'Large Envelopes (Flats)':
            if (weight < 13)
                res.write(""+flat[weight].toFixed(2));
            else
                res.write("Invalid weight");
            break;
        default:
            if (weight < 13)
                res.write(""+first[weight].toFixed(2));
            else
                res.write("Invalid weight");
            break;
    }
    res.write("</p>");
    res.send();
}


function stamp(weight){
    if (weight <= 1)
        return .50;
    else if (weight > 1 && weight <= 2)
        return .71;
    else if (weight > 2 && weight <= 3)
        return .92;
    else if (weight > 3 && weight <= 3.5)
        return 1.13;
    else return -1;
}

function metered(weight){
    if (weight <= 1)
        return .47;
    else if (weight > 1 && weight <= 2)
        return .68;
    else if (weight > 2 && weight <= 3)
        return .89;
    else if (weight > 3 && weight <= 3.5)
        return 1.10;
    else return -1;
}
