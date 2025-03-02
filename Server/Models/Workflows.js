const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connectionA } = require('./db');

const WorkflowSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    nodes: [{
        id: { type: String, required: true },
        type: { type: String, required: true },
        position: {
            x: { type: Number, required: true },
            y: { type: Number, required: true }
        },
        data: {
            userId: { type: Schema.Types.ObjectId, ref: 'users' },
            label: { type: String },
            action: { type: Number },
        }
    }],
    edges: [{
        id: { type: String, required: true },
        type: { type: String, required: true },
        sourceHandle: { type: String, required: true },
        targetHandle: { type: String, required: true },
        source: { type: String, required: true },
        target: { type: String, required: true },
        data: {
            condition: { type: String, required: true }
        }
    }],
}, {
    timestamps: true
});

const WorkflowModel = connectionA.model('workflows', WorkflowSchema);
module.exports = WorkflowModel;