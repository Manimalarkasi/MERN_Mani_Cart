const nodemailer = require('nodemailer')

const sendEmail = async options =>{
    const transport = {
        host : process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS,
        },
    };
    // const transport = {
    //     host : "sandbox.smtp.mailtrap.io",
    //     port:2525,
    //     auth:{
    //         user: "0835e7d50b2b3b",
    //         pass:"57e7836ad9e348",
    //     },
    // };
    const transporter = nodemailer.createTransport(transport);
    const message = {
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(message);
}

module.exports = sendEmail;