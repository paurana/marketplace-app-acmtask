const express = require('express')
require('./db/mongoose')
const admin = require('./admin/admin')

const userRouter = require('./routers/user')
const itemRouter = require('./routers/item')
const bidRouter =  require('./routers/bid')
const sellRouter = require('./routers/sell')
const adminRouter  = require('./routers/admin')
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(itemRouter)
app.use(bidRouter)
app.use(sellRouter)
app.use(adminRouter)
admin()

module.exports = app