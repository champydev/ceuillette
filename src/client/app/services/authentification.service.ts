import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  HttpClient, HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs';


@Injectable()
export class AuthentificationService implements CanActivate {
  private loggedSource = new Subject<boolean>();
  loggedChange$ = this.loggedSource.asObservable();
  token: string;
  private refreshTokenTaskId: any;
  constructor(private router: Router, private http: HttpClient) {

  }
  async canActivate() {
    const success = await this.refresh();

    if (success) {

      return true;

    }
    else {
      this.router.navigate(['account/signin']);
      return false;
    }


  }
  async activateAccount(token : string)
  {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/account/activate', {
        token: token
      }).subscribe(
        (data: any) => {
          resolve();
        },
        error => {
          reject(error);
        }
      );
    });
  }
  async createAccount(email : string,hash : string,nom : string,prenom : string): Promise<boolean>
  {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post('/api/account/signup', {
        email: email,
        hash: hash,
        nom: nom,
        prenom: prenom
      }).subscribe(
        (data: any) => {

          resolve(true);
        },
        error => {

          resolve(false);
        }
      );
    });
  }
  async logout(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.stopAutoRefresh();
      this.token = null;
      this.http.post('/api/account/signout', {
        token: this.token,
      }).subscribe(
        (data: any) => {
          this.router.navigate(['/account/signin']);
          this.loggedSource.next(false);
          resolve(true);
        },
        error => {
          this.token = null;
          resolve(false);
        }
      );

    });

  }
  stopAutoRefresh()
  {
    if (this.refreshTokenTaskId != null){
      clearInterval(this.refreshTokenTaskId);
      this.refreshTokenTaskId = null;
    }
  }
  startAutoRefresh() {
    console.log("startAutoRefresh");
    this.stopAutoRefresh();
    this.refreshTokenTaskId = setInterval(async () => {
      const success = await this.refresh();
      if (!success) {
        this.stopAutoRefresh();
        this.router.navigate(['/account/signin']);
      }
    }, 5000);
  }

  async refresh(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http.post('/api/account/refresh', {
        token: this.token,
      }).subscribe(
        (data: any) => {
          this.token = data.token;
          resolve(true);
        },
        error => {
          this.token = null;
          resolve(false);
        }
      );

    });
  }
  async login(email: string, hash: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post('/api/account/signin', {
        email: email,
        hash: hash
      }).subscribe(
        (data: any) => {
          this.token = data.token;
          console.log("token " + this.token);
          this.startAutoRefresh();
          this.loggedSource.next(true);
          resolve();
        },
        error => {
          this.loggedSource.next(false);
          reject(error);
        }
      );

    });
  }
}
