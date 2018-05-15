import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule,MatToolbarModule ,MatCardModule,MatIconModule,MatInputModule} from '@angular/material';
import {AuthentificationService} from './services/authentification.service';
import { ReactiveFormsModule } from '@angular/forms';  // <-- #1 import module
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent,canActivate:[AuthentificationService] },
  { path: 'login',      component: LoginComponent },

  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: HomeComponent }
];



@NgModule({
  declarations: [RootComponent,LoginComponent,HomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true,useHash:true } // <-- debugging purposes only
    )
  ],
  providers: [AuthentificationService],
  bootstrap: [RootComponent]
})
export class AppModule {}
