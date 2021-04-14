const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../profile/pic')
const sharp = require('sharp')
const {sendWelcomeEmail} = require('../emails/email')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObject) => {
            return tokenObject.token !== req.token//If the token isn't equal, it stays in the array. This ensures that if I am logged in from several devices, logging out doesn't log me out of all devices
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) //Converts object to an array of strings!
    const allowedUpdates = ['name', 'bio', 'password', 'username']
    let email = 0
    const isValidOperation = updates.every((update) => { //Checks if all the elements of an array satisfy a condition. Even if one fails, false is returned!
        if (update === 'email') {
            email = 1
            return false
        }
        else if (allowedUpdates.includes(update)) return true
    })
    if (!isValidOperation) {
        if (email === 1) return res.status(400).send({ error: 'Email cannot be changed once set' })
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send('User deleted successfully')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    await req.user.save()
    res.send()
}, (err, req, res, next) => { //Handling express errors. Function sends back an error as a JSON response
    res.status(400).send({ error: err.message })
})

router.get('/users/me/avatar', auth, async (req, res) => {
    try {
        if(!req.user.avatar){
            throw new Error('No Profile Pic Uploaded')
        }
        res.set('Content-Type','image/png')
        res.send(req.user.avatar)
    } catch (err) {
        console.log(err)
        res.status(400).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = ''.toBuffer
    await req.user.save()
    res.send()
})

module.exports = router