/*  ------------------------------------------------ *\
*   MANGOOSE
\*  ------------------------------------------------ */
/*
//  Require node module
var mangoose = require('mangoose');

//  Connect with MongoDB 
mangoose.connect('mongodb://localhost:27017/SafechatDB');

//  Default schema
var Schema = mangoose.Schema;

var personSchema = new Schema( {
	name: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	age: Number
});


module.exports = mangoose.model('Person', personSchema);


/*
personSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}*/
