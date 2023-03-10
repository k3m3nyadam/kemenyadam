import { Component } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  user: User;

  constructor(private accountService: AccountService){
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout(){
    this.accountService.logout();
  }
}
