/*  ------------------------------------------------ *\
*   NODE MODULS
\*  ------------------------------------------------ */

//  In-built Express modules
var path = require('path');
var http = require('http');
var fs = require('fs');


//  ExpressJS module
var express = require('express');
//  Make instance of express application
var app = express();

//  Make server
var server = http.createServer(app);

//  Node module for socket communication 
var socket_io = require('socket.io');
var io = socket_io.listen(server);

//  Node module for steganography
var stego = require('stegosaurus');

//  Node module for reading HTTP body content
var bodyParser = require('body-parser');


//  MONGO DB User register
//var Person = require('./Person.js');





/*  ------------------------------------------------ *\
*   MY MODULS
\*  ------------------------------------------------ */

//var cryptography = require('./public/javascripts/developer');






/*  ------------------------------------------------ *\
*   SERVER CONFIGURATION
\*  ------------------------------------------------ */

//  JADE, EJS, Handlebars
//app.set('view engine', 'jade');

//app.set('view options', { layout: true });
//app.set('views', __dirname + '/views');



//  Serving files, such as images, CSS, JavaScript and other static files is accomplished 
//  with the help of a built-in middleware in Express - express.static.
app.use(express.static(path.join(__dirname, '/public')));

//app.use(express.static(__dirname + 'public'));
//app.use(express.static('public'));
//app.use('/static', express.static(path.join(__dirname, '/public')));
//app.use(express.static(path.join(__dirname, 'public')));

//  Penn
//  app.use('/public', express.static('files'));  //  files = public ?


app.use(bodyParser.urlencoded({ extended: true}));


//  Server listening on port 3000
server.listen(process.env.PORT || 3000);
console.log('Safechat server is running on port 3000...');






/*  ------------------------------------------------ *\
*   ROUTES
\*  ------------------------------------------------ */

//  Server sends to clients - index.html
app.use('/', function(req, res) {
	res.type('html').status(200);
	res.sendFile(__dirname + '/index.html');

	//  Inside VIEW subdirextory/folder
	//red.render('index'); // with handlebars, pug, ejs

	//  Pass arguments using JS objects
	//res.render('home', {title: 'Pero'});  // with handlebars, pug, ejs

	//  REDIRECT
	//res.redirect('/views/pero.html');

});


/*
app.use('/login', function(req, res) {
	res.type('html').status(200);
	res.sendFile(__dirname + '/login.html');
});
app.use('/chat', function(req, res) {
	res.type('html').status(200);
	res.sendFile(__dirname + '/chat.html');
});
*/



/*
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

*/


/*
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
		//  Message written in console from client to server - crypted
		console.log("Crypted message : " + data); 
		//  Decrypt message on server side
		console.log("Decrypting in process..."); 
		// Takae care about this problem !!!!!!!!!!
		data = Decrypt(data);
		//  Display decrypted message in console
		console.log("Decrypted message : " + data); 
		//  After that it is emmited
		io.emit('new message', {user: socket.username, msg: data});
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




//  Take care about this problem !!!!!!
//  Export and require

/*  ------------------------------------------------ *\
*	DECRYPTING METHOD 
\*  ------------------------------------------------ */

function Decrypt(cryptText) {

	//  Array with induvidual chars, split strings in chars
	var array    = [],
		newArray = [];

		//  Uppercase whole text because of matematical operation on chars
		var uppercaseCryptText = cryptText.toUpperCase();
		//  Cast string in chars array
		array = uppercaseCryptText.split("");
		//  Array length is zero in start (logic)
		var arraylength = 0;

		//  Go through array and check for ending
		for (var i = 0; i < array.length; i++) {
			//  Output char by char in array
			console.log("Slovo : " + array[i] + "   ASCII :" + array[i].charCodeAt());

			//console.log(array[i]);

			if( (array[i-1]==' ') && (array[i]==' ') ) {
				console.log("Enter end!");
				arraylength--;
				newArray.pop();
				break;
			}
			else{
				arraylength++;
				newArray.push(array[i]);
			}
		}


		//  Fill new array with crypted content
		for (var j = 0; j < (arraylength); j++) {

			var oldCharacter = String.fromCharCode(array[j].charCodeAt());
			//console.log("OLD : " + oldCharacter.charCodeAt());

			if (oldCharacter.charCodeAt() > 64) {

				//  Calculate new character  KEY SHIFT
				var newCharacter = String.fromCharCode(oldCharacter.charCodeAt() - 13);

				//  Take care about situation whene NEW character is greater than Z, it musto go from A again
				if(newCharacter.charCodeAt() < 65)
				{
					newCharacter = String.fromCharCode(newCharacter.charCodeAt() + 26);
				}
				newArray[j] = newCharacter;
			}

			else {
				newArray[j] = oldCharacter;
			}


		}

	//  Make string from array for display purpose
	var plainText = newArray.toString();
	//  Char in array is dividede by semicolos so we need to erase semicolo
	plainText = plainText.replace(/,/g, "");

	return plainText;
}



/*  ------------------------------------------------ *\
*	STEGANOGRAPHY
\*  ------------------------------------------------ */

var original_png = "./public/images/matrix.png";		 // The original png file. 
var generated_png = "out.png";		 // The resulting file. 


var message_string = "Alan Turing"; // The message we're encoding. 
 
//  Write message inside image
stego.encodeString(original_png, generated_png, message_string, function(err){

	console.log("Inside STEGO");

    if (err) { 
    	throw err; 
    }
    console.log("Wrote png to: ", generated_png);
 
    // Now let's decode that. 
    stego.decode(generated_png,message_string.length,function(message){
        console.log("Decoded message: ", message);
    });
 
});