$(function() {

	//  Object for "on" and "emit"
	var socket = io.connect();

	//  Areas
	var cipherArea = $('#cipherArea'),
	    userArea = $('#userArea'),
	    messageArea = $('#messageArea');

	//  Forms
	var cipherForm = $('#cipherForm'),	
	    userForm = $('#userForm'),
	    messageForm = $('#messageForm');

	//  Inputs
	var cipher = $('#cipher'),
	    username = $('#username'),
	    message = $('#message');

	//  Text areas
	var chat = $('#chat'),
	    users = $('#users');

	//  Cryptography strings
	var plainText,
		cryptText;



	/*  ------------------------------------------------ *\
	*   (1) CIPHER 
	\*  ------------------------------------------------ */

	//  Method for secret key
	cipherForm.submit(function(event) {

		// Display message in console after new user is online
		console.log('Secret key submitted');

		var userSecretKeyInput = cipher.val();
		console.log(userSecretKeyInput);

		if (userSecretKeyInput == 'enigma') {
			cipherArea.hide();
			userArea.show();
			console.log("Succed with cipher key");
		} 

		else {
			console.log("Failed with cipher key");
		}

		//  Make username input form empty again
		cipher.val('');
		event.preventDefault();
	});



	/*  ------------------------------------------------ *\
	*   (2) USERS
	\*  ------------------------------------------------ */

	//  Method for user login
	userForm.submit(function(event) {

		// Display message in console after new user is online
		console.log('User : ' + username.val() + ' logged in chat');
		//  Send new user data to server
		socket.emit('new user', username.val(), function(data){
			//  Proceed from login screen to chat screen
			if(data) {
				userArea.hide();
				messageArea.show();
			}
		});
		//  Make username input form empty again
		username.val('');
		event.preventDefault();


		//  TO DO : interact with MongoDB
	});

	//  List of active user - add to user list in chat app
	socket.on('get users', function(data) {
					
		//  Array for all user/clients active on chat
		var userList = '';
		//  Go through user list array and make list item for every user
		for(i = 0; i < data.length; i++) {
			userList += '<li class="list-group-item">' + data[i] + '</li>'
		}
		//  Write userList unorder list to userlist in chat app
		users.html(userList);
	});




	/*  ------------------------------------------------ *\
	*   (3) MESSAGES 
	\*  ------------------------------------------------ */


	// Method for user communication
	messageForm.submit(function(event) {
			
		//  Get message from FORM textarea
		plainText = message.val();
		// Display action - message is submitted by user
		console.log('Client submitted message');

		// Display real message in client console
		console.log('Real message : ' + plainText);
		//  Do crypting
		cryptText = Encrypt(plainText);
		console.log('Çrypting on client side...');
		// Display crypted message in client console
		console.log('Crypted message : ' + cryptText);



		//  STEGOOBJECT must be emitted



		// Emit message - send message from client to server
		socket.emit('send message', cryptText);

		// Make textarea empty after submit, ready for new message by user
		message.val('');

		event.preventDefault();
	});


	// Get new message and display it in chat window by adding new DIV
	socket.on('new message', function(data) {

		
		cryptText = data.msg;
		plainText = Decrypt(cryptText);


		//  Add new client message to chat window
		console.log('Client - image : ' + data.image);
		chat.append('<div class="well"><strong>' + data.user + '</strong>: ' + plainText + '</div>'
			+ data.image + '</div>');
	});

});



/*  ------------------------------------------------ *\
*	ENCRYPTING METHOD 
\*  ------------------------------------------------ */

function Encrypt(plainText) {

	//  Array with induvidual chars, split strings in chars
	var array    = [],
	newArray = [];


	//  Uppercase whole text because of matematical operation on chars
	var uppercasePlainText = plainText.toUpperCase();
	//  Cast string in chars array
	array = uppercasePlainText.split("");
	//  Array length is zero in start (logic)
	var arraylength = 0;


	for (var i = 0; i < array.length; i++) {
		
		//  Output char by char in array
		console.log("Slovo : " + array[i] + "   ASCII :" + array[i].charCodeAt());

		//  If there is two empty spaces in row that means that text is over
		if((array[i-1]==' ')&&(array[i]==' ')) {
			
			//  Output important message
			console.log("Enter end!");
			//  Decrease array length because in this mode after last character first empty 
			//  space means end of the text and that is one char more than it is needed
			arraylength--;
			// First empty space at the end of message, delete it
			newArray.pop();

			//  (If there is case of two empty spaces in a row) break the loop, because 
			//  text is over
			break;
		}

		else {
			//  Increase array length in normal situation
			arraylength++;
			//  Put plan text in array for scrypt text, just in case, because than is not empty
			newArray.push(array[i]);
		}
	}


	for (var j = 0; j < arraylength; j++) {

		var oldCharacter = String.fromCharCode(array[j].charCodeAt()); 

		if (oldCharacter.charCodeAt() > 64) {

			//  Calculate new character - KEY SHIFT
			var newCharacter = String.fromCharCode(oldCharacter.charCodeAt() + 13);

			//  Take care about situation whene NEW character is greater than Z, it must go from A again
			if(newCharacter.charCodeAt() > 90)
			{
				newCharacter = String.fromCharCode(newCharacter.charCodeAt() - 26);
			}
			newArray[j] = newCharacter;
		}
						
		else {
			newArray[j] = oldCharacter;
		}
	}


	cryptText = newArray.toString();
	cryptText = cryptText.replace(/,/g, "");

	return cryptText;
}



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






