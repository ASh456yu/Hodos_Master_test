const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connectionB } = require('../Models/db')

const InvoiceSchema = new Schema({
    trip_id: {
        type: Schema.Types.ObjectId,
        ref: 'trips',
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    bills: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    isSubmitted: {
        type: Boolean,
        default: false
    }
});

const InvoiceModel = connectionB.model('invoices', InvoiceSchema);
module.exports = InvoiceModel;
