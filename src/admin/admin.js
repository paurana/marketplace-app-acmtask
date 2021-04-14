const User = require('../models/user')
const bcrypt = require('bcryptjs')

const admin = async () => {
    const user = await User.findOne({ username: 'admin' })
    if (!user) {
        const admin_profile = {
            name: 'admin',
            username: 'admin',
            password: process.env.PASSWORD,
            email: 'admin_marketplace@pilani.bits-pilani.ac.in'
        }
        const admin = new User(admin_profile)
        await admin.save()
    }
}

module.exports = admin
