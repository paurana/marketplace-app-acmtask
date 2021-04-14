const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
    bid_price: {
        required: true,
        type: Number,
    },
    bid_owner: {
        type: String,
    },
    bid_owner_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    bid_number:{
        default: 0,
        type: Number
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    bid_status:{
        default: 0,
        type: Number
    }
},{
    timestamps: true
})

const Bid = mongoose.model('Bid', bidSchema)

module.exports = Bid