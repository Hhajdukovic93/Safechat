var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//  Array for users
users = [];
//  Array for connection
connections = [];

//  Server listening on port 3000
server.listen(process.env.PORT || 3000);
console.log('Server running...');


//  Server sends to clients
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});



//  Socket communication
io.sockets.on('connection', function(socket){

	// After every new connection, increase/push connection array with new one
	connections.push(socket);
	// Display number of new sockets/connections to server in console
	console.log('Connected: %s sockets connected', connections.length)

	// Disconnect 
	socket.on('disconnect', function(data){
		
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();


		// After disconnection, decrease/pop connection array by one
		connections.splice(connections.indexOf(socket), 1);
		// Again, display number of current sockets/connections
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	

	//  Send messages
	socket.on('send message', function(data){ //  message is cought here
		console.log(data); // message written in console
		io.sockets.emit('new message', {msg: data, user: socket.username});  // after that it is emmited
	});



	//  New user
	socket.on('new user', function(data, callback){ 

		callback(true);
		socket.username = data;
		users.push(socket.username);


		updateUsernames();
	});


	function updateUsernames(){
		io.sockets.emit('get users', users)
	}
});