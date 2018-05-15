import { Component,OnInit } from '@angular/core';
import { CanActivate,Router ,ActivatedRoute}    from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {AuthentificationService} from '../../../services/authentification.service';
import { MatSnackBar } from '@angular/material';
import {SnackErrorComponent} from '../../../components/snack/error/snack.error.component';
@Component({
  selector: 'app-account-activate',
  templateUrl: './account.activate.component.html',
  styleUrls: ['./account.activate.component.css']
})
export class AccountActivateComponent implements OnInit {
  private token : string;
  errorMessage = null;
  okMessage = null;
  showProgress = true;
  accountNotExist  = false;
  accountAlreadyActivated  = false;
  accountSuccessfullActivated  = false;

  constructor( private router: Router,private route: ActivatedRoute,private authentificationService : AuthentificationService)
  {

  }

  ngOnInit() {
    this.route
        .queryParams
        .subscribe(async params => {
            await this.activateAccount(params['token']);
        });


  }

  async activateAccount(token : string)
  {
    setTimeout(async () =>{
      try{
        this.errorMessage = null;
        this.okMessage = null;
        const data : any = await this.authentificationService.activateAccount(token);
        this.showProgress = false;
        this.accountSuccessfullActivated = true;
        this.errorMessage = null;
        this.okMessage='Compte activé avec succès, redirection en cours ...';
        this.authentificationService.setLogged(data.token,data.nom,data.prenom);
        setTimeout(async () =>{
          this.router.navigate(['/home']);
        },1500);


      }
      catch(e){
        this.errorMessage = this.formatError(e);
        this.okMessage = null;
        this.showProgress = false;
      }
    },2000);


  }
  public formatError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      const err = <HttpErrorResponse>error;
      if (err.status === 401) {
        return 'Ce compte est déja activé';
      }
      else return (<HttpErrorResponse>error).message;
    } else if (error instanceof Error) {
      return (<Error>error).message;
    }
    else return "Erreur inconue : " + error.toString();
  }
}
