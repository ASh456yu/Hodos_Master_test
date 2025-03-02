const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionA} = require('./db')


const ExpenseCategorySchema = new Schema({
    name: { type: String, required: true },
    amount: { type: Number, default: 0 },
}, { _id: false });


const TravelSchema = new Schema({
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
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    exp_cat: {
        type: [ExpenseCategorySchema],
        default: [],
    },
    allowance: {
        type: Number,
        default: -1,
    },
});

const TravelModel = connectionA.model('travel', TravelSchema);
module.exports = TravelModel;