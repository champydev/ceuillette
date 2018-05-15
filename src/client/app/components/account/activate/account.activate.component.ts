import { Component,OnInit } from '@angular/core';
import { CanActivate,Router ,ActivatedRoute}    from '@angular/router';
import {AuthentificationService} from '../../../services/authentification.service';
@Component({
  selector: 'app-account-activate',
  templateUrl: './account.activate.component.html',
  styleUrls: ['./account.activate.component.css']
})
export class AccountActivateComponent implements OnInit {
  private token : string;
  showProgress = true;
  accountNotExist  = false;
  accountAlreadyActivated  = false;
  accountSuccessfullActivated  = false;

  constructor(private route: ActivatedRoute,private authentificationService : AuthentificationService)
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
        await this.authentificationService.activateAccount(token);
        this.showProgress = false;
        this.accountSuccessfullActivated = true;
      }
      catch(e){
        console.log(e);
        this.showProgress = false;
      }
    },2000);
   
    
  }
}
