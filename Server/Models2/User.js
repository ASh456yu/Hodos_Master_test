const mongoose = require('mongoose');
const {connectionB} = require('../Models/db')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});



const UserModel = connectionB.model('users', UserSchema);
module.exports = UserModel;