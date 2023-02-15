import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(private roter: Router, private accountService: AccountService){
    if(accountService.userValue){
      this.roter.navigate(['/']);
    }
  }
}
