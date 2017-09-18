var stego = require('stegosaurus');


var original_png   = 'matrix.png'; // The original png file. 
var generated_png  = 'outServer.png';	   // The resulting file. 
var message_string = 'Alan Turing'; 	   // The message we're encoding. 
 

/*  ------------------------------------------------ *\
*	ENCODING METHOD 
\*  ------------------------------------------------ */

writeInImage = function () {

	console.log('(S) Pokrenut sam na server strani');

	stego.encodeString(original_png, generated_png, message_string, function(err) {

	    if (err) { 
	    	throw err; 
	    }
	    console.log('Wrote png to: ', generated_png);
	 
 		readFromImage();
	});
};



/*  ------------------------------------------------ *\
*	DECODING METHOD 
\*  ------------------------------------------------ */

readFromImage = function() {
	
	// Now let's decode that. 
	stego.decode(generated_png,message_string.length, function(message){
	    console.log('Decoded message: ', message);
	});
};




exports.writeInImage = writeInImage;
exports.readFromImage = readFromImage;
