import { Component } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'login';
  loginForm :FormGroup;
  constructor(private fb: FormBuilder) { // <--- inject FormBuilder
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      email:  ['', [Validators.required,Validators.email ]],
      password:  ['', [Validators.required,Validators.minLength(6)]],
    });
  }
}
