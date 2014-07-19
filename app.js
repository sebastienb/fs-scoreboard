var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    colors = require('colors');

server.listen(3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});


// Initial var values
var bluepoints = "00",
    redpoints = "00",
    round = "1",
    currTime = Date.now();

var round1,
    round2,
    round3;

function addpoint(data){

    var currentBP = Number(bluepoints),
        currentRP = Number(redpoints),
        pointTime = (Date.now() - currTime) /1000;

    console.log('Score Change!'.blue);
    io.emit('status', 'Score Change!');
    console.log(pointTime);

    switch (data)
        {
           case "blueplus":
                console.log('blue team plus 1');
                // var current = Number(bluepoints);
                bluepoints = currentBP+1;
                console.log(bluepoints);
            break;
           
           case "redplus":
                console.log('Red team plus 1');
                //var current = Number(redpoints);
                redpoints = currentRP+1;
                console.log(redpoints);
            break;

           case "bluemin":
                console.log('blue team minus 1');
                //var current = Number(bluepoints);
                bluepoints = currentBP-1;
                console.log(bluepoints);
            break;

           case "redmin":
                console.log('Red team minus 1');
                //var current = Number(redpoints);
                redpoints = currentRP-1;
                console.log(redpoints);
            break;

           default: 
                console.log('unknown message received:'+data);
            break;
        };
    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round, time : pointTime});
};

console.log('Server listening on port 3000'.green);

// On first client connection start a new game
io.sockets.on('connection', function(socket){

// Game round score keeper
    

    console.log('starting'.red);
    
    io.emit('status', 'New device connected');

// Send score update to all devices on new connection
    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round});

// Receiving info from remote page        
        socket.on('score', function(data){
            
            console.log('score received from Remote'.green)
            // io.emit('score-update', data);
            addpoint(data);
        });

        socket.on('status', function(data){
            switch (data)
            { case "restart": 
                    bluepoints = "00"
                    redpoints = "00"
                    round = "1"
                    currTime = Date.now();
                    io.emit('score-update', {blue: bluepoints, red: redpoints, currentround: round});
                    console.log('Restart');
            break;
            };
        });

}); //end socket connection



// Johnny-five starts here




// Johnny-five dies here


// Start Noduino
// requirejs.config({nodeRequire: require});

//     requirejs(['public/scripts/libs/Noduino', 'public/scripts/libs/Noduino.Serial', 'public/scripts/libs/Logger'], function (NoduinoObj, NoduinoConnector, Logger) {
//       var Noduino = new NoduinoObj({'debug': false}, NoduinoConnector, Logger);
//       Noduino.connect(function(err, board) {
//         if (err) { return console.log(err); }

//         // board.withLED({pin: 12}, function(err, LED) {
//         //   if (err) { return console.log(err); }

//         //   LED.on();
//         //   LED.on('on', function(e) {
//         //     console.log('LED is on!');
//         //   });
//         // });

//         board.withButton({pin: 8}, function(err, Button) {
//             if (err) { return console.log(err); }
            
//             Button.on('release', function() {
//               console.log('Button 8 released'.blue);
//               // socket.emit('score', 'blueplus'); 
//               addpoint('blueplus');
//             });
//         });

//         board.withButton({pin: 13}, function(err, Button) {
//             if (err) { return console.log(err); }
         
//             Button.on('release', function() {
//               console.log('Button 13 released'.red);
//               // socket.emit('score', 'redplus'); 
//               addpoint('redplus');
//             });

//         });
//       });
//     });



