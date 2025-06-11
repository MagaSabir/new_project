import nodemailer from 'nodemailer'

export const nodemailerService = {

async sendEmail (email:string, code: string, template: (code: string) => string) {
    const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })


    await transporter.sendMail({
            from: `"My App" ${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Email Confirmation',
            html: template(code)
        });
    },


}