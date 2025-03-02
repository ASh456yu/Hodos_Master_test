const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionA} = require('./db')


const ChatSchema = new Schema({
    sender_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    receiver_id: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

const ChatModel = connectionA.model('chats', ChatSchema);
module.exports = ChatModel;