/*
 * steganography.js v1.0.2 2016-04-23
 *
 * Copyright (C) 2012 Peter Eigenschink (http://www.peter-eigenschink.at/)
 * Dual-licensed under MIT and Beerware license.
*/

    function makeCipherFromPlain() {
      
      var textarea = document.getElementById("text"),
        //  Take image for hide data in it
        img = document.getElementById("img"),
        //  This image is stegoobject
        cover = document.getElementById("cover"),

        stego = document.getElementById("stego"),
        message = document.getElementById("message"),
        download = document.getElementById("download");

      if(img && textarea) {

        //  Encode
        cover.src = steg.encode(textarea.value, img, {"width": img.width, "height": img.height});
        //cover.style.width = img.width;
        //cover.style.height = img.height;
 
        stego.className = "half";

        message.innerHTML = "";
        message.parentNode.className="invisible";

        download.href=cover.src.replace("image/png", "image/octet-stream");
      }

      // First stegoobject must be created
      var stegoObjectIsCreated = true;
    }
    
    function makePlainFromCipher() {

      var img = document.getElementById("img"),
        cover = document.getElementById("cover"),
      
        message = document.getElementById("message"),
        textarea = document.getElementById("text");

      if(img && textarea) {

        // Decode
        message.innerHTML = steg.decode(cover); // #IMG defautl, BUT cover

        if(message.innerHTML !== "") {

          message.parentNode.className="";
          textarea.value = message.innerHTML;       
        }
      }
    }

    window.onload = function(){
      document.getElementById('hide').addEventListener('click', makeCipherFromPlain, false);
      document.getElementById('read').addEventListener('click', makePlainFromCipher, false);
    };







console.log("STEGO included");

;(function (name, context, factory) {

  // Supports UMD. AMD, CommonJS/Node.js and browser context
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
          //console.log("Inside messageCompleted");
          var done = true;

           for(var j = 0; j < 16 && done; j+=1) {
              done = (done) && (data[i+j*4] == 255);                  
              //console.log("Done inside check for end loop : " + done);       
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


  console.log("(1) BASIC DATA");
  console.log("Message from user : " + message);
  console.log("Image to transfer : " + image);
  console.log("Image src : " + image.src);
  console.log("Options : " + options);


  if(image.length) {
    image = util.loadImg(image);
    console.log("Image length : " + image.length);
  }

  options = options || {};
  console.log("Options : " + options);
  var config = this.config;
  console.log("Congif : " + config);

  var t = options.t || config.t,
    threshold = options.threshold || config.threshold,
    codeUnitSize = options.codeUnitSize || config.codeUnitSize,
    prime = util.findNextPrime(Math.pow(2,t)),
    args = options.args || config.args,
    messageDelimiter = options.messageDelimiter || config.messageDelimiter;

  console.log("T variable : " + t);

  if(!t || t < 1 || t > 7) throw "Error: Parameter t = " + t + " is not valid: 0 < t < 8";

  //  Make CANVAS
  var shadowCanvas = document.createElement('canvas'),
      shadowCtx = shadowCanvas.getContext('2d');


  //  Canvas properties
  shadowCanvas.style.display = 'none';
  shadowCanvas.width = options.width || image.width;
  console.log("Canvas width : " + shadowCanvas.width);
  shadowCanvas.height = options.height || image.height;
  console.log("Canvas height : " + shadowCanvas.height);


  if(options.height && options.width) {
    shadowCtx.drawImage(image, 0, 0, options.width, options.height );
  } 
  else {
    shadowCtx.drawImage(image, 0, 0);
  }

  var imageData = shadowCtx.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height),
      data = imageData.data;

  console.log("Odradio image data");



  // bundlesPerChar ... Count of full t-bit-sized bundles per Character
  // overlapping ... Count of bits of the currently handled character which are not handled during each run
  // dec ... UTF-16 Unicode of the i-th character of the message
  // curOverlapping ... The count of the bits of the previous character not handled in the previous run
  // mask ... The raw initial bitmask, will be changed every run and if bits are overlapping
  var bundlesPerChar = codeUnitSize/t >> 0,
    overlapping = codeUnitSize%t,
    modMessage = [],
    decM, oldDec, oldMask, left, right,
    dec, curOverlapping, mask;


  console.log("(1) Message :  " + message);
  console.log("(1) Message length :  " + message.length);
  console.log("GET NUMBERS FROM MESSAGE");

  var i, j;
  //  Convert text to numbers
  for(i=0; i <= message.length; i+=1) {

    //  Get ASCII
    dec = message.charCodeAt(i) || 0;
    console.log("Char : " + message[i] + " to ASCII :  " + dec);

    curOverlapping = (overlapping*i)%t;

    if(curOverlapping > 0 && oldDec) {
      mask = Math.pow(2,t-curOverlapping) - 1;
      oldMask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
      left = (dec & mask) << curOverlapping;
      right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
      modMessage.push(left+right);
      //console.log("(1) Mod message :  " + modMessage);


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
    //console.log("ooldDEc :  " + oldDec);
  }
  console.log("(1) Mod message (W):  " + modMessage);



  // Write Data
  var offset, index, subOffset, delimiter = messageDelimiter(modMessage,threshold),
    q, qS;

  for(offset = 0; (offset+threshold)*4 <= data.length && (offset+threshold) <= modMessage.length; offset += threshold) {
    qS=[];

    for(i=0; i<threshold && i+offset < modMessage.length; i+=1) {
      q = 0;

      for(j=offset; j<threshold+offset && j<modMessage.length; j+=1)
        q+=modMessage[j]*Math.pow(args(i),j-offset);
      qS[i] = (255-prime+1)+(q%prime);
      //console.log("Neki qS[i] : " +  qS[i]);
    }

    for(i=offset*4; i<(offset+qS.length)*4 && i<data.length; i+=4)
      data[i+3] = qS[(i/4)%threshold];
    
    subOffset = qS.length;
    //console.log("subOffset : " +  subOffset);
  }
  // Write message-delimiter
  for(index = (offset+subOffset); index-(offset+subOffset)<delimiter.length && (offset+delimiter.length)*4<data.length; index+=1)
    data[(index*4)+3]=delimiter[index-(offset+subOffset)];
    //console.log("Data : " +  data[(index*4)+3]);
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


  console.log("(2) BASIC DATA");
  console.log("Image to transfer : " + image);
  //console.log("Image src : " + image.src);
  console.log("Options : " + options);


  console.log("(2) Unutar decode...");
  
  if(image.length) {
    image = util.loadImg(image);
  }

  options = options || {};
  console.log("(2) Options : " + options);
  var config = this.config;
  console.log("(2) Config : " + config);

  
  var t = options.t || config.t,
    threshold = options.threshold || config.threshold,
    codeUnitSize = options.codeUnitSize || config.codeUnitSize,
    prime = util.findNextPrime(Math.pow(2, t)),
    args = options.args || config.args, 
    messageCompleted = options.messageCompleted || config.messageCompleted;
    
  //console.log("Message completed: " + messageCompleted);

  console.log("(2) T : " + t);

  if(!t || t < 1 || t > 7) throw "Error: Parameter t = " + t + " is not valid: 0 < t < 8";
    
  var shadowCanvas = document.createElement('canvas'),
      shadowCtx = shadowCanvas.getContext('2d');

  shadowCanvas.style.display = 'none';
  shadowCanvas.width = options.width || image.width;
  console.log("(2) Canvas width : " + shadowCanvas.width);
  shadowCanvas.height = options.width || image.height;
  console.log("(2) Canvas height : " + shadowCanvas.height);


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

  console.log("(2) Odradio image");

  var i, k, done;

  console.log("(2) threshold : " + threshold);
  console.log("(2) Data length: " + data.length);
  console.log("(2) mod Message: " + modMessage);


  if (threshold == 1) {

    // Check for message end
    for(i=3, done=false; !done && i<data.length && !done; i+=4) { // true = !done(false)
      //console.log("<<< TRAŽENJE MODA >>>");
      done = messageCompleted(data, i, threshold);

      if(!done) { //  !done is default
        //console.log("Usao sam u MODS : " + done);
        modMessage.push(data[i]-(255-prime+1));
      }
    }
    //console.log("Final Done : " + done);
  } 
  //console.log("Look for message in stegoobject");

  // Look for hidden message in stegoobject
  var message = "", 
      charCode = 0, 
      bitCount = 0,   
      mask = Math.pow(2, codeUnitSize)-1;

  console.log("(2) Empty message :"+ message);
  console.log("(2) MOD : "+ modMessage);
  console.log("(2) MOD length :"+ modMessage.length);


  for(i = 0; i < modMessage.length; i+=1) {

    charCode += modMessage[i] << bitCount;
    //console.log("(2) Char code :"+ charCode);

    bitCount += t;
    //console.log("(2) bitCount :"+ bitCount);
    
    if(bitCount >= codeUnitSize) {

      message += String.fromCharCode(charCode & mask);
      //console.log("(2) message :"+ message);

      bitCount %= codeUnitSize;
      //console.log("(2) bitCount :"+ bitCount);

      charCode = modMessage[i] >> (t-bitCount);
      //console.log("(2) Char code :"+ charCode);
    }

  }

  if(charCode !== 0) message += String.fromCharCode(charCode & mask);

  console.log("(2) HIDDEN message :" + message);
  return message;

};
return new Cover();
});