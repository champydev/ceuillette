import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthentificationService} from '../../../services/authentification.service';
import {CryptoService} from '../../../services/crypto.service';
import { CanActivate,Router }    from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './account.signup.component.html',
  styleUrls: ['./account.signup.component.css']
})
export class AccountSignupComponent {
  title = 'signup';
  signupForm : FormGroup;
  constructor(private router: Router,private fb: FormBuilder,private cryptoService : CryptoService,private authentificationService : AuthentificationService) {
    this.createForm();
  }
  createForm() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]]
    });
  }
  onValidateClick()
  {
    const email = this.signupForm.controls['email'].value.toLowerCase();
    const hash = this.cryptoService.hashPassword(this.signupForm.controls['password'].value);
    const nom = this.signupForm.controls['nom'].value;
    const prenom = this.signupForm.controls['prenom'].value;
    this.authentificationService.createAccount(email,hash,nom,prenom);
  }
}
