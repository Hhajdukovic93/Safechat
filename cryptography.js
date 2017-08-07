//  Variables(stringa) for user text 
var plainText,
	cryptText;

//  Array with induvidual chars, split strings in chars
var array    = [],
    newArray = [];

//  DOM object for encryption button
var ceazerButtonEncryption;

//  DOM object for decryption button
var ceazerButtonDecryption;

//  DOM object for encrypted button
var displayEncryptionParagraph;

//  DOM object for crypted text
var displayDecryptionParagraph;


//  Get encryption button
ceazerButtonEncryption = document.getElementById("JS-caesar--encryption");

//  Add event listener encryption button
ceazerButtonEncryption.addEventListener("click", function onclick(event) 
{
	  	//  What method is triggered
	  	console.log("Ceasar encryption");
	  	//  Make object for manipulating with paragraph/window with crypted text (target)
		displayEncryptionParagraph = document.getElementById("JS-translate_1");

		//  Delete array content and prevous text for new iteration
	  	ClearParagraphs(displayEncryptionParagraph);

	  	//  Get plain text from user and put it in string variable
	  	plainText = document.getElementById("ceazerTextarea_1").value;

	  	//  Output plain text from user
	  	//console.log(plainText);

	  	//  Call for magic!
	  	CeaserCipherEncryption(plainText);
	  	//  Prevent action which is triggered
	    event.preventDefault();
}
);

ceazerButtonDecryption = document.getElementById("JS-caesar--decryption");
//  Add event listener to this object (button)
ceazerButtonDecryption.addEventListener("click", function onclick(event) 
{
	  	//  What method is triggered
	  	console.log("Ceasar decryption");
	  	//  Make object for manipulating with paragraph/window with encrypted text
		displayDecryptionParagraph = document.getElementById("JS-translate_2");

		//  Delete array content and prevous text for new iteration
		ClearParagraphs(displayDecryptionParagraph);

	  	//  Get crypt text from user and put it in string variable
	  	cryptText = document.getElementById("ceazerTextarea_2").value;

	  	//  Output crypt text from user
	  	//console.log(cryptText);

	  	//  Call for magic!
	  	CeaserCipherDecryption(cryptText);
	  	//  Prevent action which is triggered
	    event.preventDefault();
}
);


function ClearParagraphs(target) {
	array    = [];
	newArray = [];
	target.innerHTML = " ";
}



/*  ------------------------------------------------ *\
*   Caesar cipher method
\*  ------------------------------------------------ */  

function CeaserCipherEncryption(plainText) {

	//  Uppercase whole text because of matematical operation on chars
	var uppercasePlainText = plainText.toUpperCase();
	//  Cast string in chars array
	array = uppercasePlainText.split("");
	//  Array length is zero in start (logic)
	var arraylength = 0;

	// arraylength = array.length;
	// console.log(arraylength);

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
	//  Display array length
	//console.log("\n\nDuljina poruke : " + arraylength);

	//  Display array length
	//console.log("Original poruka : " + array);


	for (var j = 0; j < arraylength; j++) {

		var oldCharacter = String.fromCharCode(array[j].charCodeAt()); // just arrayI
		//console.log("OLD : " + oldCharacter.charCodeAt());

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

	//console.log("\n\nKriptirana poruka : " + newArray);

	var coolText = newArray.toString();
	coolText = coolText.replace(/,/g, "");

	//  Display cripted message on page
	var displayParagraph = document.getElementById("JS-translate_1"); // TO DOM objecrs

	//  
	displayParagraph.innerHTML= coolText;
}
  

/*  ------------------------------------------------ *\
*   Caesar cipher decription method 
\*  ------------------------------------------------ */ 
function CeaserCipherDecryption(cryptText) {

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
	var coolText = newArray.toString();
	//  Char in array is dividede by semicolos so we need to erase semicolo
	coolText = coolText.replace(/,/g, "");
	//  Make object for manipulating with paragraph/window with crypted text
	var displayParagraph = document.getElementById("JS-translate_2");
	//  Put crypted text in paragraf on page
	displayParagraph.innerHTML = coolText;
}



/*  ------------------------------------------------ *\
*   Caesar cipher method for different keys
\*  ------------------------------------------------ */ 

function Translate(key, plainText) 
{
	// TO DO
}



// ---------------------------------- TO DO -------------------------------------------


//  Leak of information on every character that is not uppercase   !important

//  Fix bugs for non-english character, mainly for intepuctional characters
//  AND empty space

//  Fig bug for characters over ASCII 90 because uppercase they become incorrect

//  Next method ONE-TIME PAD  :)
