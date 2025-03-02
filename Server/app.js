require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRoute');
const UserRouter = require('./Routes/UserRouter');
const GeneralRouter = require('./Routes/GeneralRoute');
const TravelRouter = require('./Routes/TravelRoute');
const BudgetRouter = require('./Routes/BudgetRoute');
const ClaimRouter = require('./Routes/ClaimRoute');
const { Server } = require('socket.io');
const http = require('http');
const ChatModel = require('./Models/Chats');
const { mongoConnect } = require('./Models/db');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");


(async () => {
    await mongoConnect();

    const port = process.env.PORT || 3000;

    app.use(
        cors({
            origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
            credentials: true,
        })
    );

    app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }));
    app.use(cookieParser());
    app.use(express.json());

    app.use('/auth', AuthRouter);
    app.use('/info', UserRouter);
    app.use('/travel', TravelRouter);
    app.use('/claim', ClaimRouter);
    app.use('/budget', BudgetRouter);
    app.use('/general', GeneralRouter);

    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log("User Connected");

        socket.on('exitsChat', async (data) => {
            let chats;

            if (data.sender_id !== data.receiver_id) {
                chats = await ChatModel.find({
                    $or: [
                        { sender_id: new mongoose.Types.ObjectId(data.sender_id), receiver_id: new mongoose.Types.ObjectId(data.receiver_id) },
                        { sender_id: new mongoose.Types.ObjectId(data.receiver_id), receiver_id: new mongoose.Types.ObjectId(data.sender_id) },
                    ],
                });
            } else {
                chats = await ChatModel.find({
                    sender_id: new mongoose.Types.ObjectId(data.sender_id),
                    receiver_id: new mongoose.Types.ObjectId(data.receiver_id),
                });
            }

            socket.emit('loadChats', { client: data.client, chats: chats });

        });



        socket.on('newMessage', (data) => {
            io.emit('newMessageResponse', data);
        });

        socket.on('typing', (data) => {
            socket.broadcast.emit('typingResponse', data);
        });

        socket.on('disconnect', () => {
            console.log("User Disconnected");
        });
    });

    server.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
})();
