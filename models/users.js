/*  ------------------------------------------------ *\
*   MANGOOSE
\*  ------------------------------------------------ */

//  Require node module
var mongoose = require('mongoose');
//  Connect with MongoDB 
mongoose.connect('mongodb://localhost:27017/SafechatDB');

//  Default schema
var Schema = mongoose.Schema;

var personSchema = new Schema( {
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

module.exports = mongoose.model('Person', personSchema);