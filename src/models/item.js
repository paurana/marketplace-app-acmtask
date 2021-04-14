const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //populate() method
    },
    base_price: {
        type: Number,
        default: 0,
        required: true,
        validate(value) {
            if (value < 0) throw new Error('Base Price Cannot be Negative!')
        }
    },
    sold_status:{
        type: Number,
        default: 0,
    },
    pic:{
        type: Buffer
    },
    category:{
        required: true,
        type: String,
        trim:true,
        lowercase: true
    }
},{
    timestamps: true
})

itemSchema.methods.toJSON = function () {
    const itemObject = this.toObject()
    delete itemObject.sold_status
    delete itemObject.pic
    delete itemObject.__v
    return itemObject
}

const Item = mongoose.model('Item', itemSchema)

module.exports = Item

