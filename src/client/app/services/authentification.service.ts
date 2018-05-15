import { Injectable }     from '@angular/core';
import { CanActivate,Router }    from '@angular/router';


@Injectable()
export class AuthentificationService implements CanActivate {
  constructor( private router: Router) {}
  canActivate() {
    console.log('AuthGuard#canActivate called');
    this.router.navigate(['/login']);
    return false;
  }
}
