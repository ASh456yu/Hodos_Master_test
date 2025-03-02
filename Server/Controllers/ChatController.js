const bcrypt = require('bcryptjs');
const ChatModel = require('../Models/Chats');

const saveChat = async (req, res) => {
    try {
        var chat = new ChatModel({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message: req.body.message,
        });
        var newChat = await chat.save();
        res.status(200).send({ success: true, msg: 'Chat inserted!', data: newChat });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const fetchChat = async (req, res) => {
    try {
        var chats = await ChatModel.find({
            $or: [
                { sender_id: req.body.sender_id, receiver_id: req.body.receiver_id },
                { sender_id: req.body.receiver_id, receiver_id: req.body.sender_id },
            ]
        });
        res.status(200).send({ success: true, msg: 'Chat Fetched!', data: chats });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports = { saveChat, fetchChat };