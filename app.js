/*  ------------------------------------------------ *\
*   NODE MODULS
\*  ------------------------------------------------ */

//  In-built Express modules
var path = require('path');
var http = require('http');
var fs   = require('fs');

//  ExpressJS module
var express = require('express');
//  Make instance of express application
var app = express();

//  Make server
var server = http.createServer(app);

//  Node module for socket communication 
var socket_io = require('socket.io');
var io = socket_io.listen(server);

//  Node module for reading HTTP body content
var bodyParser = require('body-parser');


//  MONGO DB User register
//var Person = require('./Person.js');





/*  ------------------------------------------------ *\
*   MANGOOSE
\*  ------------------------------------------------ */
/*
//  Require node module
var mangoose = require('mangoose');

//  Connect with MongoDB 
mangoose.connect('mongodb://localhost:27017/SafechatDB');

//  Default schema
var Schema = mangoose.Schema;

var personSchema = new Schema( {
	name: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	age: Number
});


module.exports = mangoose.model('Person', personSchema);


/*
personSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}*/






/*  ------------------------------------------------ *\
*   SERVER CONFIGURATION
\*  ------------------------------------------------ */

//  JADE, EJS, Handlebars
//app.set('view engine', 'jade');

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


//  Enable using HTTP body content 
app.use(bodyParser.urlencoded({ extended: true}));

//  Server listening on port 3000
server.listen(process.env.PORT || 3000);
console.log('Safechat server is running on port 3000...');





/*  ------------------------------------------------ *\
*   ROUTES
\*  ------------------------------------------------ */

//  Server sends to clients - index.html
app.get('/', function(req, res) {
	//res.type('html').status(200);
	res.sendFile(__dirname + '/index.html');

	//  Inside VIEW subdirextory/folder
	//red.render('index'); // with handlebars, pug, ejs
	//  Pass arguments using JS objects
	//res.render('home', {title: 'Pero'});  // with handlebars, pug, ejs
	//  REDIRECT
	//res.redirect('/views/pero.html');
});

/*
//  Send JS script to client
app.get('/public/javascripts/steganography.js', function(req,res) {
	res.sendFile(__dirname + '/public/javascripts/steganography.js');
});
app.use('/login', function(req, res) {
	res.type('html').status(200);
	res.sendFile(__dirname + '/login.html');
});
app.use('/chat', function(req, res) {
	res.type('html').status(200);
	res.sendFile(__dirname + '/chat.html');
});

//  ROUTE FOR CREATING USERS
app.use('/create', function(req, res) {
	var newPerson = new Person ({
		name: req.body.name,
		age: req.body.age,
	});

	newPerson.save( function(err) { 
		if (err) {
		    res.type('html').status(500);
		    res.send('Error: ' + err);
		}
		else {
		    res.render('created', {person : newPerson});
		}
	}); 
});

app.use('/created', function(req, res) {
	res.type('html').status(200);
	res.send('User created');
});

//  All kind of handle form !!!
app.use('/handleForm', function(req, res) {
	res.sendFile(__dirname + '/index.html');
	red.render('index');
	res.render('home');  // with handlebars

	res.send("Form is handled...");
});
*/





/*  ------------------------------------------------ *\
*   SOCKET COMMUNICATION
\*  ------------------------------------------------ */

//  Array for users
users = [];
//  Array for connections
connections = [];

io.on('connection', function(socket) {

	// After every new connection, increase/push connection array with new one
	connections.push(socket);
	// Display number of new sockets/connections to server in console
	console.log('Connected: %s sockets connected', connections.length);

	//  Users
	socket.on('new user', function(data, callback) { 
		callback(true);
		//  Get username from method, preciselly from method data
		socket.username = data;
		//  Put new user in users array
		users.push(socket.username);
		//  AFter every change redisplay user list ( ADD )
		updateUsernames();
	});

	//  Emit new user list using array "users" to clients
	function updateUsernames() {
		io.emit('get users', users)
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
		//  Delete username from user list after disconnected
		users.splice(users.indexOf(socket.username), 1);
		//  Display diconnected user
		console.log('Disconnected user: %s', socket.username);
		//  Update username list after change  ( DELETE )
		updateUsernames();
		// After disconnection, decrease/pop connection array by one
		connections.splice(connections.indexOf(socket), 1);
		// Again, display number of current sockets/connections
		console.log('Disconnected: %s sockets connected', connections.length);
	});
});