const Blacklist = require('../models/blacklist')

const block = async (req,res,next)=>{
    try{    
        const blocked_user = await Blacklist.findOne({user_id: req.user._id}) //why isn't findByID working?
        if(blocked_user){
            res.status(403).send({error: 'You are not allowed to put items on sale.'})
        }
        else next()
    }catch(err){
        res.status(400).send()
    }
}

module.exports = block