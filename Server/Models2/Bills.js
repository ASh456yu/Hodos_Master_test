const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionB} = require('../Models/db')

const BillSchema = new Schema({
      trip: {
            type: Schema.Types.ObjectId,
            ref: 'trips',
            required: true,
      },
      user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
      },
      name: {
            type: String,
            required: true
      },
      category: {
            type: String,
            required: true,
      },
      extradetails: {
            type: String,
            required: true,
      },
      amount: {
            type: Number,
            required: true,
      },
      date: {
            type: Date,
            required: true,
      },
});

const BillModel = connectionB.model('bills', BillSchema);
module.exports = BillModel;