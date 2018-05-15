import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthentificationService} from '../../services/authentification.service';
import {CryptoService} from '../../services/crypto.service';
import { CanActivate,Router }    from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  title = 'signup';
  signupForm : FormGroup;
  constructor(private router: Router,private fb: FormBuilder,private cryptoService : CryptoService,private authentificationService : AuthentificationService) {
    this.createForm();
  }
  createForm() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nom: ['', [Validators.required, Validators.minLength(6)]],
      prenom: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
