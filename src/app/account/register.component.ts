import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
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
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }

    get g() {return this.form.controls;}

    onSubmit(){
      this.submitted = true;
      this.alertService.clear();

      if(this.form.invalid) return;

      this.loading = true;
      this.accountService.register(this.form.value)
        .pipe(first())
        .subscribe({
          next: () =>{
            this.alertService.succes('Your registration was successful!', {keepAfterRootChange: true});
            this.router.navigate(['../login'], {relativeTo: this.route});
          },
          error: error =>{
            this.alertService.error(error);
            this.loading = false;
          }
        });
    }
}
