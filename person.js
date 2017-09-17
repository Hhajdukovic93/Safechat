/*  ------------------------------------------------ *\
*   MANGOOSE
\*  ------------------------------------------------ */
/*
//  Require node module
var mangoose = require('mangoose');

// CHECK IT !!!
//  Connect with MongoDB 
mangoose.connect('mongodb://localhost:27017/SafechatDB');

//  Default schema
var Schema = mangoose.Schema;

var personSchema = new Schema( {
	name: {type: String, required: true, unique: true},
	age: Number
});


module.exports = mangoose.model('Person', personSchema);


/*
personSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}*/


/*test = function() {
	console.log("I am inside of server.js..");
}

exports.test = test;*/