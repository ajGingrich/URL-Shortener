var express = require('express');
var path = require('path');

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