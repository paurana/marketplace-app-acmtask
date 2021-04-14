const Item = require('../models/item')
const Bid = require('../models/bid')

const bid_access = async (req, res, next) => {
    try {
        const item = await Item.findOne({ _id: req.params.id })
        if (item.owner.equals(req.user._id)) res.status(400).send({ error: 'You cannot bid on your own item!' })
        else next()
    } catch (err) {
        res.status(400).send()
    }
}

const sell_access = async (req, res, next) => {
    try {
        const bid = await Bid.findOne({ _id: req.params.id })
        if (!bid) res.status(400).send({ error: 'Bid does not exist. Enter the correct bid_id' })
        else {
            const item = await Item.findOne({ _id: bid.item_id })

            if (!(req.user._id.equals(item.owner))) res.status(400).send({ error: 'You can only finalize the deal for your items.' })
            else {
                if (bid.bid_status === 1) res.status(400).send({ error: 'Item has already been sold.' })
                else next()
            }
        }
    } catch (err) {
        res.status(400).send()
    }
}

const admin = async(req,res,next)=>{
    try{
        if(req.user.username !== 'admin') res.status(401).send({error:'Unauthorized'})
        else next()
    }catch(err){
        res.status(400).send()
    }
}

module.exports = {
    bid_access,
    sell_access,
    admin
}