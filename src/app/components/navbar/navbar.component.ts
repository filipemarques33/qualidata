import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { UserLoginDialog } from '../user-login/user-login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent {

  constructor(
    public router: Router,
    public authService: AuthService,
    private dialog: MatDialog) { }

  loginUser() {
    this.dialog.open(UserLoginDialog);
  }

  logoutUser() {
    this.authService.logoutUser();
  }

}
