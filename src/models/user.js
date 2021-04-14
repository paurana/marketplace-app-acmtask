const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Item = require('../models/item')
const Bid = require('../models/bid')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
            if (!value.endsWith(".bits-pilani.ac.in")) {
                throw new Error('The email is not associated with BITS')
            }
        }
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 8
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

userSchema.virtual('items',{
    ref: 'Item',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    delete userObject.__v
    return userObject
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })
    if(!user) throw new Error('Unable to login!')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Unable to login!')
    return user
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    await Item.deleteMany({owner: this._id, sold_status: 0})
    await Bid.deleteMany({bid_owner_id: this._id, bid_status: 0})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User