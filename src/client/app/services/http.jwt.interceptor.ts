
import { Injectable }     from '@angular/core';
import { HttpClient , HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor} from '@angular/common/http';
  
    import { Observable } from 'rxjs';
import {AuthentificationService} from './authentification.service';
@Injectable()
export class HttpJwtInterceptor implements  HttpInterceptor{
    constructor( private authentificationService: AuthentificationService) {
    
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {       
        if (this.authentificationService.token!= null){
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.authentificationService.token}`
            }
          });
        }   
        return next.handle(request);
      }
}