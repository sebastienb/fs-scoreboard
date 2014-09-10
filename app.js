var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    colors = require('colors'),
    mongoose = require('mongoose');

server.listen(3000);


// Database stuff
mongoose.connect('mongodb://foostable:republica@ds059908.mongolab.com:59908/foosball');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Yay connected to DB');
});


var gameSchema = mongoose.Schema({
    gameDate: Date,
    bluepoints: Number,
    redpoints: Number,
    bluePlayer1: String,
    bluePlayer2: String,
    redPlayer1: String,
    redPlayer2: String,

});

var gameData = mongoose.model('gameData', gameSchema)


function saveGame() {
        console.log("saving game!".yellow);

        var newGameData = new gameData({
            bluepoints: foosballGame.bluepoints, 
            redpoints: foosballGame.redpoints, 
            bluePlayer1: foosballGame.bluePlayer1,
            bluePlayer2: foosballGame.bluePlayer2,
            redPlayer1: foosballGame.redPlayer1,
            redPlayer2: foosballGame.redPlayer2,
            gameDate: foosballGame.currTime

        });
        newGameData.save(function (err) {
          if (err) return console.error(err);
          console.log('meow');
        });
};

// var playerSchema = mongoose.Schema({
//     name: String,
//     instagramId: String,
// });

// var pointSchema = mongoose.Schema({
//     pointScoredTime: String,
//     point: Number,
// });
// end Database stuff

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/games', function(req, res) {
    res.sendfile(__dirname + '/games.html');
});

// Initial var values

var foosballGame = {
    bluepoints: 0,
    redpoints:0,
    bluePlayer1:"",
    bluePlayer2:"",
    redPlayer1:"",
    redPlayer2:"",
    currTime: Date.now(),
    gamePoints:{}
};

console.log(foosballGame.currTime);

var connectCounter = "0"

function millisecondsToStr (milliseconds) {
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
   
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        var minRemainder = (temp) - (minutes * 60);   
        return minutes + ' minute' + numberEnding(minutes) + ' ' + minRemainder + ' second' + numberEnding(minRemainder);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}

function addpoint(data){

    var pointTime =     millisecondsToStr(Date.now() - foosballGame.currTime);
    // goal();
    console.log(pointTime);

    switch (data)
        {
           case "blueplus":
                console.log('blue team plus 1');
                foosballGame.bluepoints = Number(foosballGame.bluepoints)+1;
                console.log(foosballGame.bluepoints);
            break;
           
           case "redplus":
                console.log('Red team plus 1');
                foosballGame.redpoints = Number(foosballGame.redpoints)+1;
                console.log(foosballGame.redpoints);
            break;

           case "bluemin":
                console.log('blue team minus 1');
                foosballGame.bluepoints = currentBP-1;
                console.log(foosballGame.bluepoints);
            break;

           case "redmin":
                console.log('Red team minus 1');
                foosballGame.redpoints = currentRP-1;
                console.log(foosballGame.redpoints);
            break;

           default: 
                console.log('unknown message received: '+data);
            break;
        };

    // check for wins
        
    if (foosballGame.bluepoints == "10") {
        console.log("Blue team wins!".blue);
        io.emit('status', 'Blue Team Wins!');
        saveGame();
    };

    if (foosballGame.redpoints == "10") {
        console.log("Red team wins!".blue);
        io.emit('status', 'Red Team Wins!');
        saveGame();
    };

    io.emit('score-update', {blue: foosballGame.bluepoints, red: foosballGame.redpoints, time : pointTime});
    console.log('Score '+pointTime+'!'.blue);   
};

console.log('Server listening on port 3000'.green);

// On first client connection start a new game
io.sockets.on('connection', function(socket){

    gameData.find(function (err, gameData) {
      if (err) return console.error(err);
      console.log(gameData)
      io.emit('gamescores',gameData);
    });
    
    connectCounter++;
    console.log("connections: "+connectCounter);
    console.log('New device connected'.green);
    io.emit('status', 'New device connected!');

    // Send score update to all devices on new connection
    io.emit('score-update', {blue: foosballGame.bluepoints, red: foosballGame.redpoints});

    // Receiving info from remote page        
            socket.on('score', function(data){
                
                console.log('score received from Remote'.green)
                // io.emit('score-update', data);
                addpoint(data);
            });

            socket.on('status', function(data){
                switch (data)
                { case "newGame": 
                    newGame();
                break;
                };
            });

            socket.on('players', function(data){
                console.log(data);
                foosballGame.bluePlayer1 = data.bluePlayer1;
                foosballGame.bluePlayer2 = data.bluePlayer2;
                foosballGame.redPlayer1 = data.redPlayer1;
                foosballGame.redPlayer2 = data.redPlayer2;
            });

            socket.on('pointData', function(data){
                console.log(data);
            });

    function newGame() {
        foosballGame.bluepoints = "00"
        foosballGame.redpoints = "00"
        foosballGame.currTime = Date.now();
        io.emit('score-update', {blue: foosballGame.bluepoints, red: foosballGame.redpoints});
        console.log('New Game Starting');
        io.emit('status', "Starting new Game...");    
    };

    socket.on('disconnect', function() { 
        connectCounter--; console.log("connections: "+connectCounter);
    });

}); //end socket connection

// var five = require("johnny-five"),
//     board,
//     button;

// function goal() {
//     var piezo = new five.Piezo(3);
//     piezo.play({
//     // song is composed by an array of pairs of notes and beats
//     // The first argument is the note (null means "no note")
//     // The second argument is the length of time (beat) of the note (or non-note)
//         song: [
          
//             ["d4", 1/4],
//             [null, 1/8],
//             ["c#4", 1/4],
//             [null, 1/8],
//             ["g5", 1.5] 
//         ],
//         tempo: 150
//     });
// };

// board = new five.Board();

// board.on("ready", function() {
  
//     var blueSensor = new five.Button(8);
//     var redSensor = new five.Button(10);

//     board.repl.inject({
//         blueSensor: button,
//         redSensor: button
//     });

//     blueSensor.on("up", function() {
//         console.log("up");
//         addpoint("blueplus");
      
//     });

//     redSensor.on("up", function() {
//         console.log("up");
//         addpoint("redplus");
       
//     });

//     goal();
// });



