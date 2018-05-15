import { Config } from './../config';
import * as nodemailer from 'nodemailer';
import {JwtService} from './jwt.service';
export class MailService {

  public static async sendActivationMail(token: string,email:string,nom : string,prenom:string) {
    
    return new Promise<void>((resolve, reject) => {
      console.log('Config ' + Config.smtp_login + " " + Config.smtp_password);
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
        subject: 'Ceuilette : Bienvenue '+prenom+' ' +nom,
        text: 'Bonjour '+prenom+' ' +nom+',\r\n\r\n'+
        'Pour valider votre inscription veuillez cliquez sur le lien ci-dessous :\r\n\r\n'+
        Config.site_url+'/#/account/activate?token='+token+'\r\n\r\n'+
        'Bonne journée'
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
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
