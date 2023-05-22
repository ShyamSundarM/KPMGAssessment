import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../models/Token';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'https://localhost:44324/api/Auth/';
  private expirationTime: Date;
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login(cred: any) {
    var headers = new HttpHeaders().set('noToken', 'true');
    return this.http.post<Token>(this.url + 'BearerToken', cred, {
      responseType: 'json',
      headers: headers,
    });
  }

  isSessionValid(): boolean {
    //console.log(localStorage.getItem('expiration'));
    if (localStorage.getItem('expiration')) {
      if (new Date(localStorage.getItem('expiration')) > new Date()) {
        return true;
      }
      return false;
    } else return false;
  }

  // setExpiration(expiration: string) {
  //   this.expirationTime = new Date(expiration);
  // }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    this.snackBar.open('Successfully logged out', '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['barSuccess'],
    });
  }
}
