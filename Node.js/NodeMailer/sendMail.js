const nodemailer = require("nodemailer")


const sendMail = async(req,res) => {
let testAccount = await nodemailer.createTestAccount();


let transporter = await nodemailer.createTransport({
    host:"smtp.ethereal.email",
    port:587,
    auth:{
        user: 'easter60@ethereal.email',
        pass: 'WTwm1uSNPnz2kjrxDS'
    }
})

let info = await transporter.sendMail({
    from:'"Pushpender Yadav" <pushpu@gmail.com>',
    to:"pyadav96800@gmail.com",
    subject:"Hello How Are You",
    text:"Replay As Soon As Possible",
    html:"<b>How is this mail</b>"
})

console.log("Message sent : %s",info.messageId);
res.json(info)


}

module.exports = sendMail;
