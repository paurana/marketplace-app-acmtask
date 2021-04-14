const Item = require("../models/item")

const sold = async (req, res, next) => {
    const id = req.params.id
    const item = await Item.findOne({ _id: id })
    if (item === null) res.status(400).send({ error: 'Item does not exist. Check item id.' })
    else {
        if (!item.sold_status) {
            next()
        } else {
            res.status(400).send({ error: 'Item has been sold. You cannot bid or view bids for this item.' })
        }
    }
}

module.exports = sold