import { Component,OnInit,AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthentificationService } from '../../../services/authentification.service';
import { CryptoService } from '../../../services/crypto.service';
import { CanActivate, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import {SnackErrorComponent} from '../../../components/snack/error/snack.error.component';
@Component({
  selector: 'app-account-signin',
  templateUrl: './account.signin.component.html',
  styleUrls: ['./account.signin.component.css']
})
export class AccountSinginComponent implements OnInit,AfterViewInit {
  title = 'login';
  loginForm: FormGroup;
  waiting = false;
  
  

  constructor(public snackBar: MatSnackBar, private router: Router, private fb: FormBuilder, private cryptoService: CryptoService, private authentificationService: AuthentificationService) {
    this.createForm();
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remeberMe: [true, [Validators.required]]
    });
  }
  public ngAfterViewInit()
  {
    setTimeout(() =>{ this.validateAllFormFields(this.loginForm);},300);
   
  }
  public ngOnInit()
  {
      
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  async onConnectClick() {
    this.waiting = true;
    this.snackBar.dismiss();
    this.loginForm.controls['email'].disable();
    this.loginForm.controls['password'].disable();
    this.loginForm.controls['remeberMe'].disable();
    setTimeout(async () =>{
      const email = this.loginForm.controls['email'].value.toLowerCase();
    const passHash = this.cryptoService.hashPassword(this.loginForm.controls['password'].value);
    try {
      await this.authentificationService.login(email, passHash);
      this.router.navigate(['/home']);
      this.waiting = false;
      this.loginForm.controls['email'].enable();
      this.loginForm.controls['password'].enable();
      this.loginForm.controls['remeberMe'].enable();
    }
    catch (e) {
      this.waiting = false;
      this.loginForm.controls['email'].enable();
      this.loginForm.controls['password'].enable();
      this.loginForm.controls['remeberMe'].enable();
      this.snackBar.openFromComponent(SnackErrorComponent,{
        data:{
          error:this.formatError(e)
        },
        duration:3000
      });
    }
    },500);
    



  }
  public formatError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      const err = <HttpErrorResponse>error;
      if (err.status === 401) {
        return 'Cet utilisateur n\'existe pas !!!';
      }
      else return (<HttpErrorResponse>error).message;
    } else if (error instanceof Error) {
      return (<Error>error).message;
    }
    else return "Erreur inconue : " + error.toString();
  }

}
