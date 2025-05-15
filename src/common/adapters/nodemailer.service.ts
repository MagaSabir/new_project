import nodemailer from 'nodemailer'

export const nodemailerService = {

async sendEmail (email:string, code: string) {
    const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })


       let mail =  await transporter.sendMail({
            from: `"My App" ${process.env.EMAIL_USER}`,
            to: email,
            subject: 'Email Confirmation',
            html: ` <h1>Thanks for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://some-site.com/confirm-email?code=${code}'>complete registration</a>
              </p>`
        });
    return !!mail
    }
}