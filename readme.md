# Scoreboard #
Nodejs and JohnyFive scoreboard for a Fooseball table.

![alt text](http://sebastienb.com/wp-content/uploads/2014/08/Screen-Shot-2014-07-31-at-3.53.20-PM-1133x800.png "Scoreboard")

##Project description

We are quite competitive when it comes to foosball at the office, we try to mentally keep track of scores and wins over a few weeks span but that never works out. We wanted a method of tracking points that din’t involve us writing it down.

This is when we came up with the idea of building a mobile website that we would use on our phones to track game scores and stats.

Being an amateur hardware hacker, I decided to take it a step further and automate the scoring with an Arduino (To be replaced with a raspberry pi on final version) to send and receive information from the table to web page scoreboard, I used the Socket.IO library and Johnny-five library. It allowed me to capture events from the Arduino sensors mounted on the table and send them in real time to the scoreboard and also form the scoreboard back to the Arduino.

![Diagram](http://sebastienb.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-05-at-7.05.56-PM.png)

###Server to Arduino communication

Using the Johnny-Five library, when the ball goes down the goals it brakes the laser and triggers a switch that lets the server know that a point was scored.

###Server/Client communication

We are using socket.io to send information from the server in real time to the scoreboard web page.

###Counting points

To count the point a pair of lasers and photo resistors wired to an Arduino where used as buttons to trigger a function in my application to add points for each team. When the ball cuts the laser it interrupts a switch and Johnny-five on the server records the change of state and triggers a goal. To mark which player scored the goal tap his avatar, this allows the server to keep track of player performance (how quick they scored, how many autogals they scored).

![Laser sensors](http://sebastienb.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-05-at-7.10.35-PM-300x163.png)



**Main Libraries**
NodeJs, JohnnyFive and Socket.io