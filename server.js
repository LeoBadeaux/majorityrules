const express = require('express')
const fs = require('fs')
//Remove when pushed to production
/**/const WebSocket = require('ws');
/**/const wss = new WebSocket.Server({ port: 8085 });
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

app.get('/api/config', function(req, res) {
    res.sendFile(__dirname + '/private/config.json');
});

app.get('/api/users/me', function(req, res) {
    res.sendFile(__dirname + '/private/me.json');
});

app.get('/api/leaderboard', function(req, res) {
    res.sendFile(__dirname + '/private/leaderboard.json');
});
 
  app.listen(8080);
  console.log('Server is listening on port 8080');

  //Got lazy and didn't want to mess with a secondary server via a diffrent file
  //So I decided to add the socket to this file

  
  wss.broadcast = function broadcast(data) {
      wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
              client.send(data);
              //console.log(data);
          }
      });
  };
  
  wss.on('connection', (ws) => {
      ws.on('message', (data) => {
          //console.log('data received \n ' + data)
          wss.clients.forEach(function(client) {
              client.send(data.toString());
          });
      })
  })
  
  wss.broadcast = function broadcast(data) {
      wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
              client.send(data);
              //console.log(data);
          }
      });
  };
  
  wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        var msg = JSON.parse(message);
        try {
            if (msg.type == "question") {
                incrementSeconds();
                wss.broadcast(JSON.stringify({
                    type: "question",
                    question: msg.text.toString(),
                    totalQuestionCount: 12,
                    currentQuestion: 5,
                    isPrizeQuestion: false,
                    totalTimeMs: msg.totalTimeMs,
                    totalTimeLeftMs: msg.totalTimeMs,
                    ts: new Date().toISOString(),
                    c: 1
                }));
            }
        }
        catch (e) {
            console.log(e);
        }
    });
});
  
  wss.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
          //console.log('received: %s', message);
          var msg = JSON.parse(message);
          if (msg.type == "prizeReveal") {
              wss.broadcast(JSON.stringify({
                  type: "dynamicPotAnimation",
                  ts: isoDate,
                  currency: msg.prizeInfo.currency,
                  currentPrizeCents: Math.floor(parseFloat(msg.prizeInfo.prizeStr.replace("$", "").replace(",", "")) * 100),
                  currentPrizePoints: 0,
                  sent: isoDate,
                  c: 1
              }));
          }
      });
  });

  
  var seconds = 0;
  
  function incrementSeconds() {
      seconds += Math.floor(Math.random() * 734) + 1;;
      //console.log(seconds);
  }
  
  var cancel = setInterval(incrementSeconds, 2000);
  
  function broadcastStats() {
  
      let counter = 1;
      while (counter <= 10) {
          //console.log(counter);
          counter++;
      }
  
      wss.broadcast(JSON.stringify({
          type: "broadcastStats",
          ts: Date.now(),
          statusMessage: "",
          viewerCounts: {
              connected: wss.clients.size,
              playing: wss.clients.size,
              watching: 0,
          },
          c: 1,
          sent: Date.now()
      }));
  }
  setInterval(broadcastStats, 5000);
  
  wss.on('error', function(error) {
      console.log(error);
});