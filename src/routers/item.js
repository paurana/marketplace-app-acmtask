const express = require('express')
const router = new express.Router()
const Item = require('../models/item')
const auth = require('../middleware/auth')
const upload = require('../profile/pic')
const sharp = require('sharp')
const blacklist = require('../middleware/blacklist')
const Bid = require('../models/bid')

router.post('/sell', auth, blacklist, async (req, res) => {
    const item = new Item({
        ...req.body, //spread operator
        owner: req.user._id
    })
    try {
        await item.save()
        res.status(201).send(item)
    } catch (err) {
        res.status(400).send(err)
    }
})

//GET /homepage?sortBy=createdAt_recent
//GET /homepage?sortBy=basePrice_desc
//GET /homepage?category=musical_instrument
router.get('/homepage', auth, async (req, res) => {
    let items
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_') //Splits strings into arrays!
        if (parts[0] === 'createdAt') {
            let time = 1
            time = parts[1] === 'recent' ? -1 : 1
            items = await Item.find({ sold_status: 0 }).sort({ 'createdAt': time })
        }
        else if (parts[0] === 'basePrice') {
            let price = 1
            price = parts[1] === 'desc' ? -1 : 1
            items = await Item.find({ sold_status: 0 }).sort({ 'base_price': price })
        }
    } else {
        items = await Item.find({ sold_status: 0 })
    }
    if (req.query.category) {
        const category = req.query.category.replace('_', ' ').toLowerCase()
        items = items.filter(item => item.category === category)
    }
    res.send(items)
})

// GET /myitems?sortBy=createdAt_asc
router.get('/myitems', auth, async (req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_') //Splits strings into arrays!
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'items',
            options: {
                sort
            },
            match: {
                sold_status: 0
            }
        }).execPopulate()
        res.send(req.user.items)

    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/users/addphoto/:id', auth, upload.single('item'), async (req, res) => {
    const item = await Item.findOne({ _id: req.params.id })

    if (item.owner.equals(req.user._id)) {
        item.pic = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
        await item.save()
        res.send()
    } else {
        res.status(400).send({ error: 'You can only add photos of items which you have put for sale.' })
    }
}, (err, req, res, next) => { //Handling express errors. Function sends back an error as a JSON response
    res.status(400).send({ error: err.message })
})

router.delete('/users/delphoto/:id', auth, async (req, res) => {
    const item = await Item.findOne({ _id: req.params.id })

    if (item.owner.equals(req.user._id)) {
        item.pic = undefined
        await item.save()
        res.send()
    } else {
        res.status(400).send({ error: 'You can only remove photos of items which you have put for sale.' })
    }
}, (err, req, res, next) => { //Handling express errors. Function sends back an error as a JSON response
    res.status(400).send({ error: err.message })
})

router.delete('/del_item/:id', auth, async (req, res) => {
    const item = await Item.findOne({ _id: req.params.id })
    if (item.owner.equals(req.user._id)) {
        if (item.sold_status === 1) res.status(400).send({ error: 'The item has been sold already.' })
        else {
            await Bid.deleteMany({ item_id: req.params.id })
            await Item.deleteOne({ _id: req.params.id })
            res.send()
        }
    } else {
        res.status(400).send({ error: 'You can only remove items which you have put for sale.' })
    }
})

module.exports = router