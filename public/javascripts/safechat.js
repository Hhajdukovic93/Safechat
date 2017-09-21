$(function() {

	//  Object for "on" and "emit"
	var socket = io.connect();
	//  Areas
	var cipherArea  = $('#cipherArea'),
      agentArea   = $('#agentArea'),
      chatWrapper   = $('#chatWrapper'),
	    messageArea = $('#messageArea');
	//  Forms
	var cipherForm  = $('#cipherForm'),	
      agentForm   = $('#agentForm'),
	    messageForm = $('#messageForm');
	//  Inputs
	var cipher     = $('#cipher'),
      agentName  = $('#agentName'),
	    message    = $('#message');
	//  Text areas
	var chat  = $('#chat'),
	    agents = $('#agents');
	//  Cryptography strings
	var plainText,
		  cryptText;

      

	/*  ------------------------------------------------ *\
	*   (1) CIPHER 
	\*  ------------------------------------------------ */

	//  Method for secret key
	cipherForm.submit(function(event) {
		var userSecretKeyInput = cipher.val();
		if (userSecretKeyInput != 'enigma') {
      //  Make username input form empty again
      cipher.val('');
      event.preventDefault();
      return false;
		}
	});



	/*  ------------------------------------------------ *\
	*   (2) AGENTS
	\*  ------------------------------------------------ */

	//  Method for user login
	agentForm.submit(function(event) {
		//  Send new user data to server
		socket.emit('new agent', agentName.val(), function(data){
      if (data) {
        agentArea.hide();
        chatWrapper.hide(),
        messageArea.show();
      }
		});
		//  Make username input form empty again
		agentName.val('');
    event.preventDefault();
	});

	//  List of active user - add to user list in chat app
	socket.on('get agents', function(data) {
		//  Array for all user/clients active on chat
		var userList = '';
		//  Go through user list array and make list item for every user
		for(i = 0; i < data.length; i++) {
			userList += '<li class="list-group-item">' + data[i] + '</li>'
		}
		//  Write userList unorder list to userlist in chat app
		agents.html(userList);
	});



	/*  ------------------------------------------------ *\
	*   (3) MESSAGES 
	\*  ------------------------------------------------ */

	// Method for user communication
	messageForm.submit(function(event) {
		//  Get message from FORM textarea
		plainText = message.val();
		//  Do crypting
		cryptText = Encrypt(plainText);
		// Make stegoobject
    cover.src = steg.encode(cryptText, img, {"width": img.width, "height": img.height});
    stegoObject = cover.src;
		// Emit message - send message from client to server (STEGOOBJECT)
		socket.emit('send message', stegoObject);
		// Make textarea empty after submit, ready for new message by user
		message.val('');
		event.preventDefault();
	});


	// Get new message and display it in chat window by adding new DIV
	socket.on('new message', function(data) {
		// Define user
		user = data.user;
		// Define stegoobject
    cover.src = data.image;
    stegoObject = cover.src;
    // Make delay because method is longlasting
    setTimeout(function(){
	        //  Make revert steganography
	        cryptText = steg.decode(stegoObject);
	        //  Decrypt
			    plainText = Decrypt(cryptText);
			    chat.append('<div class="well"><strong>' + user + '</strong>: ' + plainText + '</div>');      
        }, 100);
	});
});



/*  ------------------------------------------------ *\
*	STEGANOGRAPHY
\*  ------------------------------------------------ */

;(function (name, context, factory) {

  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } 
  else if (typeof define === "function" && define.amd) {
    define(factory);
  } 
  else {
    context[name] = factory();
  }
})("steg", this, function () {
  var Cover = function Cover() {};
  var util = {
    "isPrime" : function(n) {
      if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false;
      if (n%2===0) return (n===2);
      if (n%3===0) return (n===3);
      var m=Math.sqrt(n);
      for (var i=5;i<=m;i+=6) {
        if (n%i===0) return false;
        if (n%(i+2)===0) return false;
      }
      return true;
    },
    "findNextPrime" : function(n) {
      for(var i=n; true; i+=1)
        if(util.isPrime(i)) return i;
    },
    "sum" : function(func, end, options) {
      var sum = 0;
      options = options || {};
      for(var i = options.start || 0; i < end; i+=(options.inc||1))
        sum += func(i) || 0;
      return (sum === 0 && options.defValue ? options.defValue : sum);
    },
    "product" : function(func, end, options) {
      var prod = 1;
      options = options || {};
      for(var i = options.start || 0; i < end; i+=(options.inc||1))
        prod *= func(i) || 1;
      return (prod === 1 && options.defValue ? options.defValue : prod);
    },
    "createArrayFromArgs" : function(args,index,threshold) {
      var ret = new Array(threshold-1);
      for(var i = 0; i < threshold; i+=1)
        ret[i] = args(i >= index ? i+1:i);
      return ret;
    },
    "loadImg": function(url) {
      var image = new Image();
      image.src = url;
      while(image.hasOwnProperty('complete') && !image.complete) {}
      return image;
    }
  };
  Cover.prototype.config = {
    "t": 3,
    "threshold": 1,
    "codeUnitSize": 16,
    "args": function(i) { return i+1; },
    "messageDelimiter": function(modMessage,threshold) {
              var delimiter = new Array(threshold*3);
              for(var i = 0; i < delimiter.length; i+=1)
                delimiter[i] = 255;        
              return delimiter;
            },
    "messageCompleted": function(data, i, threshold) {
            var done = true;
             for(var j = 0; j < 16 && done; j+=1) {
                done = (done) && (data[i+j*4] == 255);                        
              }
              return done;
            }
  };
  Cover.prototype.getHidingCapacity = function(image, options) {
    options = options || {};
    var config = this.config;
    var width = options.width || image.width,
        height = options.height || image.height,
        t = options.t || config.t,
        codeUnitSize = options.codeUnitSize || config.codeUnitSize;
        return t*width*height/codeUnitSize >> 0;
  };



  /*  ------------------------------------------------ *\
  *   ENCODE
  \*  ------------------------------------------------ */

  Cover.prototype.encode = function(message, image, options) {
    if(image.length) {
      image = util.loadImg(image);
    }
    options = options || {};
    var config = this.config;
    var t = options.t || config.t,
      threshold = options.threshold || config.threshold,
      codeUnitSize = options.codeUnitSize || config.codeUnitSize,
      prime = util.findNextPrime(Math.pow(2,t)),
      args = options.args || config.args,
      messageDelimiter = options.messageDelimiter || config.messageDelimiter;
    if(!t || t < 1 || t > 7) throw "Error: Parameter t = " + t + " is not valid: 0 < t < 8";

    var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');
    shadowCanvas.style.display = 'none';
    shadowCanvas.width = options.width || image.width;
    shadowCanvas.height = options.height || image.height;
    if(options.height && options.width) {
      shadowCtx.drawImage(image, 0, 0, options.width, options.height );
    } 
    else {
      shadowCtx.drawImage(image, 0, 0);
    }
    var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
        data = imageData.data;
    var bundlesPerChar = codeUnitSize/t >> 0,
      overlapping = codeUnitSize%t,
      modMessage = [],
      decM, oldDec, oldMask, left, right,
      dec, curOverlapping, mask;
    var i, j;
    for(i=0; i <= message.length; i+=1) {
      dec = message.charCodeAt(i) || 0;
      curOverlapping = (overlapping*i)%t;
      if(curOverlapping > 0 && oldDec) {
        mask = Math.pow(2,t-curOverlapping) - 1;
        oldMask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
        left = (dec & mask) << curOverlapping;
        right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
        modMessage.push(left+right);
        if(i<message.length) {
          mask = Math.pow(2,2*t-curOverlapping) * (1 - Math.pow(2, -t));
          for(j=1; j<bundlesPerChar; j+=1) {
            decM = dec & mask;
            modMessage.push(decM >> (((j-1)*t)+(t-curOverlapping)));
            mask <<= t;
          }
          if((overlapping*(i+1))%t === 0) {
            mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2,-t));
            decM = dec & mask;
            modMessage.push(decM >> (codeUnitSize-t));
          }
          else if(((((overlapping*(i+1))%t) + (t-curOverlapping)) <= t)) {
            decM = dec & mask;
            modMessage.push(decM >> (((bundlesPerChar-1)*t)+(t-curOverlapping)));
          }
        }
      }
      else if(i<message.length) {
        mask = Math.pow(2,t) - 1;
        for(j=0; j<bundlesPerChar; j+=1) {
          decM = dec & mask;
          modMessage.push(decM >> (j*t));
          mask <<= t;
        }
      }
      oldDec = dec;
    }
    var offset, index, subOffset, delimiter = messageDelimiter(modMessage,threshold),
      q, qS;
    for(offset = 0; (offset+threshold)*4 <= data.length && (offset+threshold) <= modMessage.length; offset += threshold) {
      qS=[];
      for(i=0; i<threshold && i+offset < modMessage.length; i+=1) {
        q = 0;
        for(j=offset; j<threshold+offset && j<modMessage.length; j+=1)
          q+=modMessage[j]*Math.pow(args(i),j-offset);
        qS[i] = (255-prime+1)+(q%prime);
      }
      for(i=offset*4; i<(offset+qS.length)*4 && i<data.length; i+=4)
        data[i+3] = qS[(i/4)%threshold];
      
      subOffset = qS.length;
    }
    // Write message-delimiter
    for(index = (offset+subOffset); index-(offset+subOffset)<delimiter.length && (offset+delimiter.length)*4<data.length; index+=1)
      data[(index*4)+3]=delimiter[index-(offset+subOffset)];

    // Clear remaining data
    for(i=((index+1)*4)+3; i<data.length; i+=4) data[i] = 255;
    imageData.data = data;
    shadowCtx.putImageData(imageData, 0, 0);
    return shadowCanvas.toDataURL();
  };



  /*  ------------------------------------------------ *\
  *   DECODE
  \*  ------------------------------------------------ */

  Cover.prototype.decode = function(image, options) {
    if(image.length) {
      image = util.loadImg(image);
    }
    options = options || {};
    var config = this.config;
    var t = options.t || config.t,
      threshold = options.threshold || config.threshold,
      codeUnitSize = options.codeUnitSize || config.codeUnitSize,
      prime = util.findNextPrime(Math.pow(2, t)),
      args = options.args || config.args, 
      messageCompleted = options.messageCompleted || config.messageCompleted;
    if(!t || t < 1 || t > 7) throw "Error: Parameter t = " + t + " is not valid: 0 < t < 8";
    var shadowCanvas = document.createElement('canvas'),
        shadowCtx = shadowCanvas.getContext('2d');
    shadowCanvas.style.display = 'none';
    shadowCanvas.width = options.width || image.width;
    shadowCanvas.height = options.width || image.height;
    if(options.height && options.width) {
      shadowCtx.drawImage(image, 0, 0, options.width, options.height );
    } 
    else {
      shadowCtx.drawImage(image, 0, 0);
    }
    var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
        data = imageData.data,
        modMessage = [],
        q;
    var i, k, done;
    if (threshold == 1) {
      // Check for message end
      for(i=3, done=false; !done && i<data.length && !done; i+=4) { // true = !done(false)
        done = messageCompleted(data, i, threshold);
        if(!done) { 
          modMessage.push(data[i]-(255-prime+1));
        }
      }
    } 
    var message = "", 
        charCode = 0, 
        bitCount = 0,   
        mask = Math.pow(2, codeUnitSize)-1;
    for(i = 0; i < modMessage.length; i+=1) {
      charCode += modMessage[i] << bitCount;
      bitCount += t;
      if(bitCount >= codeUnitSize) {
        message += String.fromCharCode(charCode & mask);
        bitCount %= codeUnitSize;
        charCode = modMessage[i] >> (t-bitCount);
      }
    }
    if(charCode !== 0) message += String.fromCharCode(charCode & mask);
    return message;
  };
  return new Cover();
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
		//  If there is two empty spaces in row that means that text is over
		if((array[i-1]==' ')&&(array[i]==' ')) {
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