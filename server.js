var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//  Array for users
users = [];
//  Array for connections
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
		
		//  Delete username from user list after disconnected
		users.splice(users.indexOf(socket.username), 1);
		//  Update username list after change
		updateUsernames();

		// After disconnection, decrease/pop connection array by one
		connections.splice(connections.indexOf(socket), 1);
		// Again, display number of current sockets/connections
		console.log('Disconnected: %s sockets connected', connections.length);
	});
	

	//  Send messages, message from client is cought here
	socket.on('send message', function(data){ 
		//  Message written in console - not crypted
		console.log("Crypted message : " + data); 


		console.log("Decrypting in process..."); 
		data = Decrypt(data);

		console.log("Derypted message : " + data); 


		//  After that it is emmited
		io.sockets.emit('new message', {msg: data, user: socket.username});
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


// ---------------------------------------------------------------------------------  //

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

		// arraylength = array.length;
		//console.log(arraylength);

		for (var i = 0; i < array.length; i++) {

			console.log(array[i]);

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

		//  Display array length
		//console.log("\n\nDuljina poruke : " + arraylength);
		//  Display array length
		//console.log("Kriptirana poruka : " + array);

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

		//console.log("\n\nOriginal poruka : " + newArray);

		//  Make string from array for display purpose
		var plainText = newArray.toString();
		//  Char in array is dividede by semicolos so we need to erase semicolo
		plainText = plainText.replace(/,/g, "");

		return plainText;

}