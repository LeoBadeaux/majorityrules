const express = require('express')
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));

// index page
app.get('/', function(req, res) {
    res.render('home');
  });
 
  app.listen(8080);
  console.log('Server is listening on port 8080');