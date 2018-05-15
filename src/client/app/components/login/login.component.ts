import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthentificationService} from '../../services/authentification.service';
import {CryptoService} from '../../services/crypto.service';
import { CanActivate,Router }    from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'login';
  loginForm: FormGroup;
  constructor(private router: Router,private fb: FormBuilder,private cryptoService : CryptoService,private authentificationService : AuthentificationService) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remeberMe: [true, [Validators.required]]
    });
  }
  async onConnectClick() {
    const email = this.loginForm.controls['email'].value.toLowerCase();
    const passHash = this.cryptoService.hashPassword(this.loginForm.controls['password'].value);
    const logged = await this.authentificationService.login(email,passHash);
    if (logged)
    {
      this.router.navigate(['/home']);
    }
  }
 
}
