import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  submitted = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {}

    ngOnInit(): void {
      this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }

    get g() {return this.form.controls;}

    onSubmit(){
      this.submitted = true;
      this.alertService.clear();

      if(this.form.invalid) return;

      this.loading = true;
      this.accountService.login(this.g.username.value, this.g.password.value)
        .pipe(first())
        .subscribe({
          next: () =>{
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: error =>{
            this.alertService.error(error);
            this.loading = false;
          }
        });
    }
}
