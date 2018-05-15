import { Config } from './../config';
import * as nodemailer from 'nodemailer';

export class MailService {
  public static async sendActivationMail(email, hash, nom, prenom) {
    return new Promise<void>((resolve, reject) => {
      console.log('Config '+ Config.smtp_login+" "+Config.smtp_password);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: Config.smtp_login,
          pass: Config.smtp_password
        }
      });
      const mailOptions = {
        from: Config.smtp_sender,
        to: email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve();
        }
      });
    });
  }
}
