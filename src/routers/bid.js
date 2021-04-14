const express = require('express')
const router = new express.Router()
const Bid = require('../models/bid')
const auth = require('../middleware/auth')
const Item = require('../models/item')
const sold = require('../middleware/sold')
const {bid_access} = require('../middleware/access')

router.post('/bid/:id', auth, sold, bid_access, async (req, res) => {
    const bid = await Bid.findOne({ item_id: req.params.id, bid_owner_id: req.user._id })

    if (bid !== null) {
        res.status(400).send({ error: "Go to 'Update Bid on an Item' to change your existing bid" })
    } else {
        const item = await Item.findOne({ _id: req.params.id })
        req.body.item_id = req.params.id
        req.body.bid_owner = req.user.name
        req.body.bid_owner_id = req.user._id
        req.body.bid_number = 1
        const new_bid = new Bid(req.body)

        try {
            let boo = false
            let foo = true
            const all_bids = await Bid.find({ item_id: req.params.id })
            let max = {}
            const length = all_bids.length

            if (length === 0) { //if no existings bids, compare with item's base price
                item_obj = await Item.findOne({ _id: req.params.id })
                max = {
                    bid_price: item_obj.base_price
                }
                if (!(req.body.bid_price - max.bid_price >= 0)) {
                    foo = false
                    res.status(400).send({ error: "Bid must be equal to or larger than the item's base price", base_price: max.bid_price })
                }
                else boo = true
            }
            else {
                max = all_bids.reduce((prev, current) => (prev.y > current.y) ? prev : current)
                if (!(req.body.bid_price - max.bid_price >= 10)) {
                    foo = false
                    res.status(400).send({ error: 'Bid amount must be atleast 10Rs more than the current bid', current_bid: max.bid_price })
                }
                else boo = true
            }
            if (boo && foo) {
                await new_bid.save()
                res.send(new_bid)
            }
        } catch (err) {
            res.status(400).send()
        }
    }
})

router.patch('/bid/:id', auth, sold, bid_access, async (req, res) => {
    const bid = await Bid.findOne({ item_id: req.params.id, bid_owner_id: req.user._id })

    if (bid === null) res.status(400).send({ error: "No existing bids found, Go to 'Bid on an Item'" })
    else {
        try {
            const all_bids = await Bid.find({ item_id: req.params.id })
            const max = all_bids.reduce((prev, current) => (prev.y > current.y) ? prev : current)
            if (!(req.body.bid_price - max.bid_price >= 10)) res.status(400).send({ error: 'Bid amount must be atleast 10Rs more than the current bid', current_bid: max.bid_price })
            else {
                bid.bid_price = req.body.bid_price
                bid.bid_number = bid.bid_number + 1
                await bid.save()
                res.send(bid)
            }
        } catch (err) {
            res.status(400).send()
        }
    }
})

router.get('/bids/:id', auth, sold, async (req, res) => {
    const bids = await Bid.find({ item_id: req.params.id }).sort({ 'updatedAt': -1 })
    res.send(bids)
})

module.exports = router
