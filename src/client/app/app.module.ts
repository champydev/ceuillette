import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';

import {HomeComponent} from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
  MatProgressBarModule,
   MatCheckboxModule,MatToolbarModule ,MatCardModule,
  MatIconModule,MatInputModule,MatStepperModule,MatProgressSpinnerModule,MatSnackBarModule} from '@angular/material';
import {AuthentificationService} from './services/authentification.service';
import { ReactiveFormsModule } from '@angular/forms';
import {CryptoService} from './services/crypto.service';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpJwtInterceptor} from './services/http.jwt.interceptor';
import {AccountDetailComponent} from './components/account/detail/account.detail.component';
import {AccountSinginComponent} from './components/account/signin/account.signin.component';
import {AccountSignupComponent} from './components/account/signup/account.signup.component';
import {AccountActivateComponent} from  './components/account/activate/account.activate.component';
import {SnackErrorComponent} from './components/snack/error/snack.error.component';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent,canActivate:[AuthentificationService] },
  { path: 'account/detail', component: AccountDetailComponent,canActivate:[AuthentificationService] },
  { path: 'account/signin',      component: AccountSinginComponent },
  { path: 'account/signup',      component: AccountSignupComponent },
  { path: 'account/activate',   component: AccountActivateComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: HomeComponent }
];



@NgModule({
  declarations: [RootComponent,HomeComponent,SnackErrorComponent,AccountSinginComponent,AccountActivateComponent,AccountSignupComponent,AccountDetailComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatStepperModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash:true }
    )
  ],
  entryComponents:[SnackErrorComponent],
  providers: [AuthentificationService,CryptoService,{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpJwtInterceptor,
    multi: true
  }],
  bootstrap: [RootComponent]
})
export class AppModule {}
