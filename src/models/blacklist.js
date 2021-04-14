const mongoose = require('mongoose')

const blacklistSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        unique: true
    }
}) 

const Blacklist = mongoose.model('Blacklist', blacklistSchema)

module.exports = Blacklist