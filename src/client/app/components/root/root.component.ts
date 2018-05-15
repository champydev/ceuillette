import { Component } from '@angular/core';
import {AuthentificationService} from '../../services/authentification.service';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent {
  title = 'root';
  isLogged : boolean = false;
  constructor(private authentificationService : AuthentificationService,private router: Router)
  {
    this.authentificationService.loggedChange$.subscribe((logged : boolean) =>{
      this.isLogged = logged;
    });
  }
  async onConnectClick()
  {
    this.router.navigate(['/account/signin']);
  }
  async onSignupClick()
  {
    this.router.navigate(['/account/signup']);
  }
  async onAccountClick()
  {
    this.router.navigate(['/account/detail']);
  }
  async onDisconnectClick()
  {
    this.authentificationService.logout();
  }
  async onHomeClick()
  {
    this.router.navigate(['/home']);
  }
}
