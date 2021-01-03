import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { NetworkService } from 'src/app/services/network-service';
import { UserLoginDialog } from '../user-login/user-login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements AfterViewInit {

  constructor(public router: Router, public authService: AuthService, private dialog: MatDialog, private networkService: NetworkService) { }

  async ngAfterViewInit() {
    await this.authService.loginUser('jonathas.sardinha@gmail.com');
  }

  loginUser() {
    this.dialog.open(UserLoginDialog, {
      width: '300px'
    });
  }

  logoutUser() {
    this.authService.logoutUser();
  }

  saveChanges() {
    this.networkService.saveChanges();
  }

}
