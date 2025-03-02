const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {connectionA} = require('./db')

const BillSchema = new Schema({
   amount: {
         type: Number,
         required: true,
   },
   date:{
         type: Date,
         required: true,
   },
});

const BillModel = connectionA.model('bills', BillSchema);
module.exports = BillModel;