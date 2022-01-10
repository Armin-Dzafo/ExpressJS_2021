const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmailEthereal = async (req, res) => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'francesco.kuhn4@ethereal.email',
            pass: 'Wn3q7UsABWrsdGn9sw'
        }
    });
    let info = await transporter.sendMail({
        from: '"Alojs B." <alojsbirmingham@gmail.com>',
        to: "bar@example.com",
        subject: "Hello from Alojs!",
        text: "Hello my dear friend! How are you today?",
        html: "<h3>Sent via Node.js</h3>",
    })
    // res.send('send email functionality');
    res.json(info);
};

const sendEmail = async (req, res) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.RECEIVER_EMAIL, // Change to your recipient
        from: process.env.SENDER_EMAIL, // Change to your verified sender
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js and some .env!!!',
        html: '<strong>and easy to do anywhere, even with Node.js and .env!</strong>',
        };
        const info = await sgMail.send(msg);
        res.json(info);
};

module.exports = sendEmail;