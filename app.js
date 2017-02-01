var express = require('express');
var path = require('path');

/*-------MongoDB----------*/
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

var url = process.env.MONGOLAB_URI;

// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);

        // do some work here with the database.

        //Close connection
        db.close();
    }
});

var app = express();

app.set('port', (process.env.PORT || 5000));

//configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

//use middleware

//define routes
//home
app.get('/', function (req, res) {

    res.render('index')
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});