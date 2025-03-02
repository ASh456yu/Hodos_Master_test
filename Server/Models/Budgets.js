const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connectionA } = require('./db')


const tripdetail = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: 'travel',
        default: null
    },
    status: {
        type: String,
        default: null,
    },
    comments: {
        type: String,
        default: null
    }
}, { _id: false })


const BudgetSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    budget: {
        type: String,
        required: true
    },
    trip: {
        detail: [tripdetail],
        right_claims: {
            type: Number,
            default: 0
        },
        false_claims: {
            type: Number,
            default: 0
        }
    },
});

const BudgetModel = connectionA.model('budgets', BudgetSchema);
module.exports = BudgetModel;