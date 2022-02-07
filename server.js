const express = require('express')
const fs = require('fs')
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

// set the view engine to ejs
app.set('json spaces', 2);

// index page
app.get('/', function(req, res) {
    res.render('home');
});

// Api Routes
app.get('/api/schedule', function(req, res) {
    res.sendFile(__dirname + '/private/schedule.json');
});
 
  app.listen(8080);
  console.log('Server is listening on port 8080');