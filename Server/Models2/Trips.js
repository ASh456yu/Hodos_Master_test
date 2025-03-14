const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connectionB } = require('../Models/db')

const TripSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    employees_ids: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        required: true,
    },
    workflow: {
        id: { type: Schema.Types.ObjectId, ref: 'workflows', default: null },
        currentNode: { type: String, default: null },
        currentApprover: { type: Schema.Types.ObjectId, ref: 'users', default: null },
        currentAction: {type: Number, default: null},
        approvalHistory: [{
            nodeId: String,
            approverId: { type: Schema.Types.ObjectId, ref: 'users' },
            action: Number,
            approved: Boolean,
            comments: String,
            timestamp: Date
        }]
    },
    company: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    start_date: {
        type: String,
        required: true,
    },
    end_date: {
        type: String,
        required: true,
    },
    estimated_cost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
});

const TripModel = connectionB.model('trips', TripSchema);
module.exports = TripModel;
