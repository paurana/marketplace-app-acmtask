const express = require('express')
const router = new express.Router()
const Item = require('../models/item')
const Bid = require('../models/bid')
const auth = require('../middleware/auth')
const {sell_access} = require('../middleware/access')
const {finalDealBuyer, finalDealSeller} = require('../emails/email')
const User = require('../models/user')

router.get('/sold', auth, async (req, res) => {
    const sold = await Item.find({ owner: req.user._id, sold_status: 1 })
    res.send(sold)
})

router.get('/mypurchases', auth, async (req, res) => {
    const bid = await Bid.find({ bid_owner_id: req.user._id, bid_status: 1 })
    res.send(bid)
})

router.post('/sell/:id', auth, sell_access, async (req, res) => { //Accept id of the bid
    try {
        const bid = await Bid.findOne({ _id: req.params.id })
        const item = await Item.findOne({ _id: bid.item_id })
        bid.bid_status = 1
        await bid.save()
        item.sold_status = 1
        await item.save()
        const seller = await User.findOne({_id: item.owner})
        const buyer = await User.findOne({_id: bid.bid_owner_id})
        finalDealBuyer(seller.name, seller.email, buyer.name, buyer.email)
        finalDealSeller(seller.name, seller.email, buyer.name, buyer.email)
        res.send(bid)
    } catch (err) {
        res.status(400).send()
    }
})

module.exports = router