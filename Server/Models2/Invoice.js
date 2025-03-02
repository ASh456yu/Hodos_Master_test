const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connectionB } = require('../Models/db')

const InvoiceSchema = new Schema({
    trip_id: {
        type: Schema.Types.ObjectId,
        ref: 'trips',
        required: true,
    },
    workflow: {
        type: Schema.Types.ObjectId,
        ref: 'workflows',
    },
    total: {
        type: Number,
        required: true
    },
    completion: {
        type: Number,
        required: true
    },
    submit_date: {
        type: String,
        required: true,
    },
});

const InvoiceModel = connectionB.model('invoices', InvoiceSchema);
module.exports = InvoiceModel;
