const express = require('express')
const router = new express.Router()
const {admin} = require('../middleware/access')
const Blacklist = require('../models/blacklist')
const auth = require('../middleware/auth')
const User = require('../models/user')
const Item = require('../models/item')
const Bid = require('../models/bid')

router.get('/ban/:id', auth, admin, async(req,res)=>{
    const id = {
        user_id: req.params.id
    }
    const blocked = new Blacklist(id)
    await blocked.save()
    res.send()
})

router.get('/unban/:id',auth, admin, async(req,res)=>{
    await Blacklist.deleteOne({user_id: req.params.id})
    res.send()
})

router.delete('/delete/:id', auth, admin, async(req,res)=>{
    const user = await User.findOne({_id: req.params.id})
    if(!user) res.status(400).send({error: 'User does not exist'})
    else{
        await User.deleteOne({_id: req.params.id})
        await Item.deleteMany({owner: req.params.id, sold_status: 0})
        await Bid.deleteMany({bid_owner_id: req.params.id, bid_status: 0})
        res.send('User deleted')
    }
})

module.exports = router