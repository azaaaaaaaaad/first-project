import nodemailer from 'nodemailer'
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.node_env === 'production', // true for port 465, false for other ports
        auth: {
            user: "jrazad10@gmail.com",
            pass: "peph wzqg kyrc fauf",
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: 'jrazad10@gmail.com', // sender address
        to, // list of receivers
        subject: "change your pass in  10 mins", // Subject line
        text: '', // plain text body
        html, // html body
    });

}