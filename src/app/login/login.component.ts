import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('pwd')
  passwordField!: ElementRef;
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  isLoading = false;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  emailVar!: string;
  pwdVar!: string;
  onLoginClick(form: any) {
    form.form.disable();
    this.isLoading = true;
    this.authService
      .login(form.form.value)
      .pipe(
        catchError((err) => {
          form.form.enable();
          this.isLoading = false;
          //console.log(err);
          if (err.status === 0) {
            this.snackBar.open('Network Error Occured', '', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: ['barError'],
            });
            //console.log('Some network error occured');
          }
          if (err.status === 400) {
            this.snackBar.open(err.error.errorMessage, '', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: ['barError'],
            });
            this.passwordField.nativeElement.value = '';
            //console.log('Wrong credentials');
          }
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((res) => {
        form.form.enable();
        this.isLoading = false;
        this.snackBar.open('Login Success', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: ['barSuccess'],
        });
        localStorage.setItem('token', res.token);
        localStorage.setItem('expiration', res.expiration);
        localStorage.setItem('user', form.form.value.email);
        this.router.navigate(['home']);
        setInterval(() => console.log(this.authService.isSessionValid()), 1000);
      });
  }
}
