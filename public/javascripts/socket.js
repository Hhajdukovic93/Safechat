console.log("Socket included");

$(function() {

	var socket = io.connect();

	//  Default screen for secret input
	var secretFormArea = $('#secretFormArea');
	//  First visible than after login hidden
	var userFormArea = $('#userFormArea');
	//  First hidden than after login visible
	var messageArea = $('#messageArea');
				

	//  Chat space
	var chat = $('#chat');
	//  List of active users
	var users = $('#users');


				//  Secret key form
				var secretForm = $('#secretForm');
				//  User login form
				var userForm = $('#userForm');
				//  User secret key guess
				var secret = $('#secret');
				//  New user
				var username = $('#username');

				//  Message form
				var messageForm = $('#messageForm');
				//  Client message
				var message = $('#message');
				

				//  Variables for client messages - used for cryptography
				var plainText,
					cryptText;



	//  Method for secret key
	secretForm.submit(function(event) {

					// Display message in console after new user is online
					console.log('Secret key submitted');

					var userSecretKeyInput = secret.val();
					console.log(userSecretKeyInput);


					if (userSecretKeyInput == 'enigma') {

						secretFormArea.hide();
						userFormArea.show();

						console.log("Succed with secret key");

					} else {
						console.log("Failed with secret key");
					}

					//  Make username input form empty again
					secret.val('');

					event.preventDefault();
	});



	//  Method for user login
	userForm.submit(function(event) {

					// Display message in console after new user is online
					console.log('User : ' + username.val() + ' logged in chat');

					//  Send new user data to server
					socket.emit('new user', username.val(), function(data){
						//  Proceed from login screen to chat screen
						if(data) {
							userFormArea.hide();
							messageArea.show();
						}
					});
					//  Make username input form empty again
					username.val('');

					event.preventDefault();
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

		// Emit message - send message from client to server
		socket.emit('send message', cryptText);

		// Make textarea empty after submit, ready for new message by user
		message.val('');

		event.preventDefault();
	});


	// Get new message and display it in chat window by adding new DIV
	socket.on('new message', function(data) {
		//  Add new client message to chat window
		chat.append('<div class="well"><strong>' + data.user + '</strong>: ' + data.msg + '</div>')
	});

});