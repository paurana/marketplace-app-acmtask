const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'bits.marketplace.acmtask@gmail.com',
        subject: 'Thanks for joining BITS Marketplace!',
        text: `Welcome to BITS Marketplace, ${name}. \nLet us know how you get along with the app.`
    })
}

const userCancellationEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from: 'bits.marketplace.acmtask@gmail.com',
        subject: 'Your account has been deleted',
        text: `Hey ${name}, it's sad to see you leave. Is there anything we could've done better?`
    })
}

const finalDealBuyer = (seller, seller_mail, buyer, buyer_mail) =>{
    sgMail.send({
        to:buyer_mail,
        from: 'bits.marketplace.acmtask@gmail.com',
        subject: 'Your bid on BITS Marketplace has been accepted',
        text: `Hey ${buyer}, your bid has been accepted by ${seller}. \nSeller's Email ID is ${seller_mail}.`
    })
}

const finalDealSeller = (seller, seller_mail, buyer, buyer_mail) =>{
    sgMail.send({
        to:seller_mail,
        from: 'bits.marketplace.acmtask@gmail.com',
        subject: `You have accepted ${buyer}'s bid on BITS Marketplace`,
        text: `Hey ${seller}, you have accepeted ${buyer}'s bid. \nBidder's Email ID is ${buyer_mail}.`
    })
}

module.exports = {
    sendWelcomeEmail,
    userCancellationEmail,
    finalDealBuyer,
    finalDealSeller
}
