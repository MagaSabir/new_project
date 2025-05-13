import nodemailer from 'nodemailer'
import {inflate} from "node:zlib";
export const nodemailerService = {

async sendEmail (email:string, code: string) {
    const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'testnodemailer001@mail.ru',
                pass: 'cutgeMzZNNY13MR6UpfC',
            },
        })


       let mail =  await transporter.sendMail({
            from: `"My App" testnodemailer001@mail.ru`,
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