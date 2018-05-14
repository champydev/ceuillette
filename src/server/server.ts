import * as restify from 'restify';
import * as path from 'path';
//import {AuthenticateController} from './controllers/authenticate.controller';
export default class Server
{
    private _restifyServer : restify.Server;
    constructor()
    {
        this._restifyServer = restify.createServer({
            name: 'Cesium Démo',
            version: '1.0.0'
        });
        this.configurePlugins();
        this.configureRoutes();
   
    }
    private configureRoutes()
    {
        const ngAppPath = path.join(__dirname,'..','client');      
        console.log("path "+ngAppPath);
        this._restifyServer.get('/*',
            restify.plugins.serveStatic({
              directory:ngAppPath,
              default: 'index.html'
            })
          );
      //  const authenticateController = new  AuthenticateController();
      //  authenticateController.configureRoutes(this._restifyServer);
    }
    private configurePlugins()
    {
        this._restifyServer.use(restify.plugins.acceptParser(this._restifyServer.acceptable));
        this._restifyServer.use(restify.plugins.queryParser());
        this._restifyServer.use(restify.plugins.bodyParser());
    }
    start()
    {
        const port = process.env.PORT || 80;
        this._restifyServer.listen(port, () =>{
            console.log('%s running on %s',  this._restifyServer.name,  this._restifyServer.url);
        });
    }
}