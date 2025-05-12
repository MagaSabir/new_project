import nodemailer from 'nodemailer'
const transport = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export const sendConfirmationEmail = async (email: string, code: string) => {
    await transport.sendMail({
        from: `Confirmation Code ${process.env.MAIL_USER}`,
        to: email,
        subject: 'Email Confirmation',
        html: ` <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>`
    })
}