import * as restify from 'restify';
import { JwtService } from '../services/jwt.service';
import { DataService } from '../services/data.service';

import {MailService} from '../services/mail.service';
export class AuthentificationController {
  configureRoutes(server: restify.Server) {
    server.post('/api/token', this.token);
    server.post('/api/login', this.login);
    server.post('/api/logout', this.logout);
    server.post('/api/refresh', this.refresh);
    server.post('/api/signup', this.signup);
  }
  async signup(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    const me = this;
    if (req.body == null) {
      return next(new Error('Missing body'));
    }
    if (req.body.email == null) {
      return next(new Error('Missing email'));
    }
    if (req.body.hash == null) {
      return next(new Error('Missing hash'));
    }
    if (req.body.nom == null) {
      return next(new Error('Missing nom'));
    }
    if (req.body.prenom == null) {
      return next(new Error('Missing prenom'));
    }
    let sql = 'select * from public.user where email=$1';
    const result = await DataService.executeQuery(sql, [req.body.email]);
    if (result.rowCount === 1) {
      if (result.rows[0].activated) {
        return next(new Error('Ce compte est déja activé'));
      } else {
        try {
          await MailService.sendActivationMail(
            req.body.email,
            req.body.hash,
            req.body.nom,
            req.body.prenom
          );
          return next(
            new Error(
              "Ce compte existe déja mais n'as jamais été activé, un e-mail d'activation viens d'être envoyé à l'adresse " +
                req.body.email
            )
          );
        } catch (e) {
          console.log(e);
          return next(e);

        }

      }
    } else {
      sql =
        'insert into public.user (email,hash,nom,prenom,activated) values ($1,$2,$3,$4,$5)';
      try {

        const insertResult = await DataService.executeQuery(sql, [
          req.body.email,
          req.body.hash,
          req.body.nom,
          req.body.prenom,
          false
        ]);
        try {
          await MailService.sendActivationMail(
            req.body.email,
            req.body.hash,
            req.body.nom,
            req.body.prenom
          );
          res.json(200, {});
          return next();
        } catch (e) {
          console.log(e);
          return next(e);

        }

      } catch (e) {
        console.log(e);
        return next(e);
      }
    }
  }

  async token(req: restify.Request, res: restify.Response, next: restify.Next) {
    let token = req.header('Authorization');
    if (token.indexOf('Bearer ') === 0) {
      token = token.substring(7);
    }
    try {
      const result = await JwtService.validateToken(token);
      res.json(200, {
        token: token
      });
      return next();
    } catch (e) {
      return next(e);
    }
  }
  async login(req: restify.Request, res: restify.Response, next: restify.Next) {
    if (req.body == null) {
      return next(new Error('Missing body'));
    }
    if (req.body.email == null) {
      return next(new Error('Missing email'));
    }
    if (req.body.hash == null) {
      return next(new Error('Missing hash'));
    }

    const dataService = new DataService();
    const sql =
      'select * from public.user where email=$1 and hash=$2 and activated=$3';
    const result = await DataService.executeQuery(sql, [
      req.body.email,
      req.body.hash,
      true
    ]);

    if (result.rowCount === 1) {
      const token = await JwtService.generateToken(result.rows[0].id);
      res.json(200, {
        token: token,
        nom: result.rows[0].nom,
        prenom: result.rows[0].prenom
      });
      return next();
    } else {
      return next(new Error('Unauthorized'));
    }
  }

  logout(req: restify.Request, res: restify.Response, next: restify.Next) {
    res.json(200, {});
  }
  async refresh(
    req: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) {
    let token = req.header('Authorization');
    if (token == null) {
      return next(new Error('No token'));
    }
    if (token.indexOf('Bearer ') === 0) {
      token = token.substring(7);
    }
    try {
      const result: any = await JwtService.validateToken(token);
      token = await JwtService.generateToken(result.userId);
      res.json(200, {
        token: token
      });
      return next();
    } catch (e) {
      return next(e);
    }
  }
}
