jQuery(function($){
		
		var socket = io.connect();

		var blue_points = $(".blue_points");
		var red_points = $(".red_points");
		var alertDiv = $("div#status");

		var blueround1 = $(".r1-blue"); 
		var blueround2 = $(".r2-blue");
		var blueround3 = $(".r3-blue");

		var redround1 = $(".r1-red");
		var redround2 = $(".r2-red");
		var redround3 = $(".r3-red");

		var currentRound = $(".round");

		var bluePlus = $('#blueplus');
	    var redPlus = $('#redplus');
	    var blueMin = $('#bluemin');
	    var redMin = $('#redmin');
	    var newGame = $('#newGame');

	    var minutes = 0;
		var seconds = 0;
		var pointState = "";

		function sendPlayerNames(){

			var bluePlayer1 = $('#blue-player-1-input').val();
			var bluePlayer2 = $('#blue-player-2-input').val();
			var redPlayer1 = $('#red-player-1-input').val();
			var redPlayer2 = $('#red-player-2-input').val();
			
			socket.emit('players', {bluePlayer1: bluePlayer1, bluePlayer2: bluePlayer2, redPlayer1: redPlayer1, redPlayer2: redPlayer2});
			$("#blue-player-1").attr({
			  src: "http://avatars.io/instagram/"+bluePlayer1,
			  rel: bluePlayer1
			});

			$("#blue-player-2").attr({
			  src: "http://avatars.io/instagram/"+bluePlayer2,
			  rel: bluePlayer2
			});
			$("#red-player-1").attr({
			  src: "http://avatars.io/instagram/"+redPlayer1,
			  rel: redPlayer1
			});
			$("#red-player-2").attr({
			  src: "http://avatars.io/instagram/"+redPlayer2,
			  rel: redPlayer2
			});
		};

		$("#NewGame").click(function(e) {
			e.preventDefault();
			console.log('test');
			socket.emit('status', 'newGame');
			sendPlayerNames();
			$("#game-settings").velocity("transition.slideUpOut");
			$('.scoreboard').delay(800).velocity("transition.bounceIn");
		});

		$("#restart").click(function(e) {
			e.preventDefault();
			socket.emit('status', 'newGame');
			sendPlayerNames();
			second = 0;
			$('#gamelogs').html("");
		});


		
		socket.on('connect', function () {
	        console.log("connected!!");
	        socket.emit('status', 'Display connected');
    	});


		socket.on('disconnect', function () {
	        console.log("disconnected!!");
	        alertDiv.html("Lost connection to server!");
	       
    	});

		socket.on('status', function(data){
			
			console.log(data);
			alertDiv.html(data);

			if (data == "Starting new Game...") {
				minutes = 0;
	      		seconds = 0;
			};

		});

		socket.on('score-update', function(data){

			// $("li.Score").velocity("callout.pulse");
			var pointTime = data.time;
			console.log('score update received');
			// WIP to parse score msg

			if (blue_points.html() != data.blue) {
				blue_points.html(data.blue);
				$('#gamelogs').prepend('<li class="blue">Blue team sores! <span class="scoreby">Tap Player</span> <span class="point-time">'+pointTime+'</span></li>');
				pointState = "blue";
				console.log('blue team scores');
			};

			if (red_points.html() != data.red) {
				red_points.html(data.red);
				$('#gamelogs').prepend('<li class="red">Red team sores! <span class="scoreby">Tap Player</span> <span class="point-time">'+pointTime+'</span></li>');
				pointState = "red";
				console.log('red team scores');
			};

			//console.log(data.time);
		});

		//Scored By function

		$('li.players img').click(function() {
			$(this).velocity("callout.tada");
			$('#gamelogs li:first-of-type span.scoreby').html($(this).attr("rel"));
			
			console.log(pointState);
			// Check for autogoal

			if ($(this).hasClass(pointState)) {
				
				socket.emit('pointData', {player:$(this).attr("rel"), pointTime: $('#gamelogs li:first-of-type span.point-time').html(), point:'1'});
				console.log('Goal!!');
				$(this).next().css("display", "block");

				var playerPoints = (Number($(this).next().html())+1);
				console.log(playerPoints);
				$(this).next().html(playerPoints);


			}else{
				socket.emit('pointData', {player:$(this).attr("rel"), pointTime: $('#gamelogs li:first-of-type span.point-time').html(), point: '-1'});
				console.log('Autogoal!!!');
				$(this).next().css("display", "block");
				var playerPoints = (Number($(this).next().html())-1);
				console.log(playerPoints);
				$(this).next().html(playerPoints);
			};


		});

		// Manula score controller
		bluePlus.click(function() {
	      socket.emit('score', 'blueplus');
	    });

	    blueMin.click(function() {
	      socket.emit('score', 'bluemin');
	    });

	    redPlus.click(function() {
	      socket.emit('score', 'redplus');
	    });

	    redMin.click(function() {
	      socket.emit('score', 'redmin');
	    });

	    newGame.click(function() {
	      socket.emit('status', 'newGame');
	    });

	    // Game Clock
		setInterval(function() {
		        updateClock()
		}, 1000);

		function updateClock() {
			second = 0;

		    if (seconds > 59) {
		        seconds -= 60;
		        minutes++;
		    }
		    if (minutes > 23) {
		        minutes = 0;
		    }
		    $("#clock").html(minutes + ':' + seconds);

		    seconds++;
		}
	});