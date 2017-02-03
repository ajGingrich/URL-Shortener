var express = require('express');
var path = require('path');
var validUrl = require('valid-url');

/*-------MongoDB----------*/
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = process.env.MONGOLAB_URI;

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

//catch the favicon first
app.get('/favicon.ico', function(req, res) {
    //var input = req.params.id;
    res.json(204);
});

var info = {original_url: "", short_url: ""};

//get new URL, add to database and send
app.get('/new/:url*', function (req, res) {
    var input = req.params['url'] + req.params[0];
    info.original_url = input;
    var randomNum =  Math.floor(100000 + Math.random() * 900000);

    //regex.test(input);
    if (validUrl.isUri(input)) {
        //info.short_url = "http://localhost:5000/"  + randomNum;
        info.short_url = "https://urlshortener320.herokuapp.com/" + randomNum;

        // Use connect method and insert to the Server
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection('urls');

                collection.insert(info, function(err, data) {
                    if (err) {
                        return err;
                    }
                    else {
                        console.log(data);
                    }
                });

                //Close connection
                db.close();
            }
        });
        info = {original_url: input, short_url:  "http://localhost:5000/"  + randomNum};
    }
    else {
        info = {error: "Please enter a URL in the correct format as shown in the instructions"}
    }

    res.json(info);
});

//redirect
app.get('/:id', function (req, res){
    var number = req.params.id;

    if (/^\d+$/.test(number)) {
        //check that number is in db.
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server. Error:', err);
            } else {
                var collection = db.collection('urls');

                collection.find({
                    short_url: 'https://urlshortener320.herokuapp.com/' + number
                    //short_url: 'http://localhost:5000/' + number
                }).toArray(function(err, documents) {
                    if (err) {
                        return err;
                    }

                    res.writeHead(301,
                        {Location: documents[0].original_url}
                    );
                    res.end();

                });

                //Close connection
                db.close();
            }

        });
    }
    else {
        var errorMessage = "please enter a valid number";
        res.json(errorMessage);
    }

});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});