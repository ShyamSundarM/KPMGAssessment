import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  user: string = '';
  constructor(public authService: AuthService) {
    //this.user = localStorage.getItem('user').split('@')[0];
  }
  getUserName() {
    if (this.authService.isSessionValid()) {
      let name = localStorage.getItem('user').split('@')[0];
      this.user = name.charAt(0).toUpperCase() + name.substring(1);
    }
    return this.user;
  }
}
