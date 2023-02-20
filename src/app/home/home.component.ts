import { Component } from '@angular/core';
import { User } from '@app/_models/user';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  user: User;

  constructor(private accountService: AccountService){
    this.user = this.accountService.userValue;
  }
}
