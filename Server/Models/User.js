const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionA} = require('./db');


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
    position: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    employee_id: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    approvals: {
        trip_approval:{
            type: Number,
            required: true,
        },
        claim_approval:{
            type: Number,
            required: true,
        },
        workflow_approval:{
            type: Number,
            required: true,
        },
    },
    workflow: {
        workflow_id: {
            type: Schema.Types.ObjectId,
            default: null
        },
        action: {
            type: Number,
            default: null
        },
    }
});

const UserModel = connectionA.model('users', UserSchema);
module.exports = UserModel;