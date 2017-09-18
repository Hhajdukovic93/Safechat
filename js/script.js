/*  ------------------------------------------------ *\
*	JQUERY
\*  ------------------------------------------------ */

var $ = require('jquery');
//$('body').css('background', '#DDD');


/*  ------------------------------------------------ *\
*	STEAGNOGRAPHY
\*  ------------------------------------------------ */

var fs = require('fs');
/* 
fs.mkdir('/home', function() {
    fs.writeFile('/home/hello-world.txt', 'Hello world!\n', function() {
        fs.readFile('/home/hello-world.txt', 'utf-8', function(err, data) {
            console.log(data);
        });
    });
});

*/

//var fs = require('fs');

var stego = require('stegosaurus');


//var original_png   = 'matrix.png'; // The original png file. 
var generated_png  = 'outClient.png';	   // The resulting file. 
var message_string = 'Client is Alan Turing'; 	   // The message we're encoding. 
 


var picture = $('#matrix')[0];
console.log("image src " + picture.src);

var original_png = picture.src;




/*  ------------------------------------------------ *\
*	ENCODING METHOD 
\*  ------------------------------------------------ */

writeInImage = function () {

	console.log('(S) Pokrenut sam na klijent strani');

	stego.encodeString(original_png, generated_png, message_string, function(err) {

		console.log('Unutar pisanja...')

	    if (err) { 
	    	throw err; 
	    }
	    console.log('Wrote png to: ', generated_png);
	 
 		//readFromImage();
	});
};



/*  ------------------------------------------------ *\
*	DECODING METHOD 
\*  ------------------------------------------------ */

readFromImage = function() {
	
	// Now let's decode that. 
	stego.decode(generated_png,message_string.length, function(message){
		console.log('Unutar citanja...')
	    console.log('Decoded message: ', message);
	});
};

//writeInImage();


//exports.writeInImage = writeInImage;
//exports.readFromImage = readFromImage;







/*  ------------------------------------------------ *\
*	STEGGY
\*  ------------------------------------------------ */

//var steggy = require('steggy');
 
//var original = fs.readFileSync(original_png); // buffer 
//var message = 'keep it secret, keep it safe'; // string or buffer 
 
// encoding should be supplied if message is provided as a string in non-default encoding 
//var concealed = steggy.conceal(/* optional password */)(original, message /*, encoding */);
//fs.writeFileSync('http://localhost:3000/images/izlaz.png', concealed);


 
//var image = fs.readFileSync('./path/to/image.png');
// Returns a string if encoding is provided, otherwise a buffer 
//var revealed = steggy.reveal(/* optional password */)(image /*, encoding */)

//console.log(revealed.toString())


/*  ------------------------------------------------ *\
*	STEGANOGRE
\*  ------------------------------------------------ */
/*
var steganogre = require('steganogre');


var encoded = steganogre.encodeString('Hopa cupa');
var img = new Image();
var a = document.createElement('a');
 

// set generated imageData to img element src to preview it 
img.src = encoded.dataURL; 

// set download link for generated image with encoded data 
a.href = encoded.downloadHref(); 
*/

/*
var steganogre = require('steganogre');
var decoding = steganogre.decodeToString('http://imgur.com/URL_TO_YOUR_IMAGE_WITH_ENCODED_MESSAGE');
 
decoding.then(function(msg) {
  console.log(msg);
})
*/


/*  ------------------------------------------------ *\
*	PNG STASH
\*  ------------------------------------------------ */

/*
var pngStash = require('png-stash');
 

var i = original_png;

var stash = pngStash(i, function(err, stash) {
    if (err) throw new Error(err);
 
    stash.write("Code underpants is go. Make it so.");
    stash.save(finished);
 
    function finished(err) {
        if (err) throw new Error(err);
        console.log("Message stored!");
    }; 
});

*/
/*
var pngStash = require('png-stash');
 
var stash = pngStash('avatar.png', function(err, stash) {
    if (err) throw new Error(err);
 
    var message = stash.read(0, 34); // 34 is length of message from example 1. 
 
    console.log(message);
});

*/