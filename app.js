/*  ------------------------------------------------ *\
*   NODE MODULS
\*  ------------------------------------------------ */

//  In-built node modules
var path = require('path');
var http = require('http');
var fs   = require('fs');

//  External Node modules
var express    = require('express');
var socket_io  = require('socket.io');
var bodyParser = require('body-parser');

//  My modules
var Person = require('./models/users.js');



/*  ------------------------------------------------ *\
*   SERVER CONFIGURATION
\*  ------------------------------------------------ */

//  Make instance of express application
var app = express();
//  Make server
var server = http.createServer(app);
//  Node module for socket communication 
var io = socket_io.listen(server);
//  Server listening on port 3000
server.listen(process.env.PORT || 3000);
console.log('Safechat server is running on port 3000...');

//  Enable using HTTP body content 
app.use(bodyParser.urlencoded({ extended: true}));
//  View engine
app.set('view engine', 'ejs');
//  Serving files, such as images, CSS, JavaScript and other static files
app.use(express.static(path.join(__dirname, '/public')));



/*  ------------------------------------------------ *\
*   ROUTES
\*  ------------------------------------------------ */

//  Default route server sends to clients
app.get('/', function(req, res) {
	res.status(200);
	res.type('html');
	res.sendFile(__dirname + '/public/cipher.html');
});
//  Route to login (2) after cipher (1) 
app.get('/login', function(req, res) {
	res.status(200);
	res.type('html');
	res.sendFile(__dirname + '/public/login.html');
});
//  Route to chat (3) after login (2) 
app.post('/chat', function(req, res) {
	var query    = {};
	var username = req.body.username;
	var password = req.body.password;

	query.username = username;
	query.password = password;

	Person.find(query, function(err, result) {
		if(err) {
			res.type('html').status(500);
			res.send('Error : ' + err);
		}
		else {
			if(result.length == 0 ) {
				res.render('failed', {user : username});			
			}
			else {
				res.sendFile(__dirname + '/public/chat.html');
			}
		}
	});
});
//  Create user in database
app.use('/registered', function(req, res) {
	var newPerson = new Person ({
		username: req.body.username,
		password: req.body.password,
	});
	newPerson.save( function(err) { 
		if (err) {
		    res.type('html').status(500);
		    res.send('Error: ' + err);
		}
		else {
		    res.render('registered', {person : newPerson});
		}
	}); 
});



/*  ------------------------------------------------ *\
*   SOCKET COMMUNICATION
\*  ------------------------------------------------ */

//  Array for users
var agents = [];
//  Array for connections
var connections = [];

io.on('connection', function(socket) {
	// After every new connection, increase/push connection array with new one
	connections.push(socket);
	//  Users
	socket.on('new agent', function(data, callback) { 
		callback(true);
		//  Get username from method, preciselly from method data
		socket.username = data;
		//  Put new user in users array
		agents.push(socket.username);
		//  After every change redisplay user list
		updateUsernames();
	});

	//  Emit new user list using array "users" to clients
	function updateUsernames() {
		io.emit('get agents', agents)
	}

	//  Messages
	socket.on('send message', function(data)  { 
		//  Stegoobject from client
		stegoImage = data;
		//  Emmit stegoobject to all clients
		io.emit('new message', { user: socket.username, image: stegoImage });
	});

	// Disconnecting 
	socket.on('disconnect', function(data){
		// After disconnection, decrease/pop connection array by one
		connections.splice(connections.indexOf(socket), 1);
		if ((agents.length)==(connections.length + 1)) {
			//Delete username from user list after disconnected
			agents.splice(agents.indexOf(socket.username), 1); 
		    //Update username list after change  ( DELETE )
			updateUsernames();
		}
	});
});