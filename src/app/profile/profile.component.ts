import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '@app/_services/account.service';
import { AlertService } from '@app/_services/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  form: FormGroup;
  id: string;
  loading = false;
  submitting = false;
  submitted = false;
  users: any[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [
        Validators.minLength(8),
        ...(this.id ? [] : [Validators.required])
      ]]
    });

    if(this.id){
      this.loading = true;
      this.accountService.getById(this.id).pipe(first())
        .subscribe(x => {
          this.form.patchValue(x);
          this.loading = false;
        });
    }
  }

  get g(){return this.form.controls;}

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    if(this.form.invalid) return;

    this.submitting = true;
    this.saveUser().pipe(first())
      .subscribe({
        next: () => {
          this.alertService.succes('User saved', {keepAfterRootChange: true});
          this.accountService.logout();
        },
        error: error => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }

  private saveUser(){
    return this.id 
      ? this.accountService.update(this.id, this.form.value)
      : this.accountService.register(this.form.value);
  }

  deleteUser(){
    confirm("Are you sure you want to delete this user?")
    ? this.accountService.delete(this.id)
      .pipe(first())
      .subscribe(() => console.log("User deleted sucessfully"))
    : "";
  }
}
