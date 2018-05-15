import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule,MatToolbarModule ,MatCardModule,MatIconModule,MatInputModule,MatStepperModule} from '@angular/material';
import {AuthentificationService} from './services/authentification.service';
import { ReactiveFormsModule } from '@angular/forms';
import {CryptoService} from './services/crypto.service';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpJwtInterceptor} from './services/http.jwt.interceptor';
import {AccountComponent} from './components/account/account.component';
import {SignupComponent} from './components/signup/signup.component';
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent,canActivate:[AuthentificationService] },
  { path: 'account', component: AccountComponent,canActivate:[AuthentificationService] },
  { path: 'login',      component: LoginComponent },
  { path: 'signup',      component: SignupComponent },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: HomeComponent }
];



@NgModule({
  declarations: [RootComponent,LoginComponent,HomeComponent,AccountComponent,SignupComponent],
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
    MatCardModule,
    MatIconModule,
    RouterModule.forRoot(
      appRoutes,
      { useHash:true }
    )
  ],
  providers: [AuthentificationService,CryptoService,{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpJwtInterceptor,
    multi: true
  }],
  bootstrap: [RootComponent]
})
export class AppModule {}
