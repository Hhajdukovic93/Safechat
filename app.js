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
var pug        = require('pug');

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






//  JADE, EJS, Handlebars

app.set('view engine', 'ejs');
//app.set('view options', { layout: true });
//app.set('views', __dirname + '/views');


//app.set('view engine', 'ejs');
//app.set('view options', { layout: true });
//app.set('views', __dirname + '/views');



//  Serving files, such as images, CSS, JavaScript and other static files is accomplished 
//  with the help of a built-in middleware in Express - express.static.
app.use(express.static(path.join(__dirname, '/public')));  // Used in index.html

//app.use(express.static(__dirname + 'public'));
//app.use(express.static('public'));
//app.use('/static', express.static(path.join(__dirname, '/public')));
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/public', express.static('files'));  //  files = public ?






/*  ------------------------------------------------ *\
*   ROUTES
\*  ------------------------------------------------ */

//  Server sends to clients - index.html
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

//  Route to chat (3) after login (2) 
app.post('/chat', function(req, res) {
	
	var query = {};

	var username = req.body.username;
	var password = req.body.password;
	query.username = username;
	query.password = password;

	Person.find( query,  function(err, result) {

		if(err) {
			res.type('html').status(500);
			res.send('Error : ' + err);
		}
		else {
			if(result.length == 0 ) {
				res.send("Fails");				
			}
			else {
				res.sendFile(__dirname + '/chat.html');
			}
		}
	});
});

//  Show all from database
app.use('/all', function(req, res) {  // use for chat user list

	Person.find( function(err, allPeople) {
		if(err) {
			res.type('html').status(500);
			res.send('Error : ' + err);
		}
		else if(allPeople.length == 0) {
			res.type('html').status(300);
			res.send('There are no people');
		}
		else {
			res.render('showAll', { people: allPeople });			
		}
	});
});





/*
//  Server sends to clients - index.html
app.get('/', function(req, res) {
	res.status(200);
	res.type('html');
	res.sendFile(__dirname + '/index.html');
	//res.redirect('/views/pero.html');  // TO login/registration
	//  Inside VIEW subdirextory/folder
	//red.render('index'); // with handlebars, pug, ejs
	//  Pass arguments using JS objects
	//res.render('home', {title: 'Pero'});  // with handlebars, pug, ejs
	//  REDIRECT
	//res.redirect('/views/pero.html');
});
*/



//  Server sends to clients - index.html
//app.get('/*default*/', function(req, res) {
//	res.status(404);
//	res.send('Not found');
	//res.sendFile(__dirname + '/404.html');
//});

/*
; 
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
	// Display number of new sockets/connections to server in console
	console.log('Connected: %s sockets connected', connections.length);

	//  Users
	socket.on('new agent', function(data, callback) { 

		console.log("Na server prijavljen : " + data);

		callback(true);
		//  Get username from method, preciselly from method data
		socket.username = data;
		//  Put new user in users array
		agents.push(socket.username);
		console.log("Agents online : " + agents.length); 


		for(i = 0; i < agents.length; i++) {
			console.log("Agents () : " + agents[i]); 
		}

		//  AFter every change redisplay user list ( ADD )
		updateUsernames();
	});

	//  Emit new user list using array "users" to clients
	function updateUsernames() {
		io.emit('get agents', agents)
	}

	//  Messages
	socket.on('send message', function(data)  { 
		//  Stegoobject from client
		console.log("Stegoobject came to server from client"); 
		stegoImage = data;
		//  Emmit stegoobject to all clients
		io.emit('new message', { user: socket.username, image: stegoImage });
	});

	// Disconnecting 
	socket.on('disconnect', function(data){

		// After disconnection, decrease/pop connection array by one
		connections.splice(connections.indexOf(socket), 1);
		// Again, display number of current sockets/connections
		console.log('Disconnected: %s sockets connected', connections.length);

		if ((agents.length) ==  (connections.length + 1)) {

			//Delete username from user list after disconnected
			agents.splice(agents.indexOf(socket.username), 1); 
		    //Display diconnected user
			console.log('Disconnected user: %s', socket.username);
		    //Update username list after change  ( DELETE )
			updateUsernames();
		}
	});
});