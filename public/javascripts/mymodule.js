(function(exports){

    // your code goes here

   exports.test = function(){
        //return 'hello world'
        console.log("MY MODULE");
    };

})(typeof exports === 'undefined' ? this['mymodule'] = {} : exports);