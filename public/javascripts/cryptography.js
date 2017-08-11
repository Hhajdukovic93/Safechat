console.log("Cryptography included");



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
