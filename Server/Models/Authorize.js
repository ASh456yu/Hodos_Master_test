const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionA} = require('./db');


const AuthSchema = new Schema({
    company: {
        type: String,
        required: true,
        unique: true,
    },
    authorized_id: {
        type: [Schema.Types.ObjectId],
        required: true,
    }
});

const AuthModel = connectionA.model('authorize', AuthSchema);
module.exports = AuthModel;