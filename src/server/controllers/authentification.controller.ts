import * as restify from 'restify';
import { JwtService } from '../services/jwt.service';
import { DataService } from '../services/data.service';
export class AuthentificationController {
  configureRoutes(server: restify.Server) {
    server.post('/api/token', this.token);
    server.post('/api/login', this.login);
    server.post('/api/logout', this.logout);
    server.post('/api/refresh', this.refresh);
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
    console.log('login ' + req.body.email + ' ' + req.body.hash);
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
