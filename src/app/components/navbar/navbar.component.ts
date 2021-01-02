import { AfterViewInit, Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { UserLoginDialog } from '../user-login/user-login.component';
import { MatSidenav } from '@angular/material/sidenav';

interface NavItem {
  text: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NavBarComponent implements AfterViewInit {

  navItems: NavItem[] = [
    {
      text: 'Fontes',
      route: '/sources',
      icon: 'description',
    },
    {
      text: 'Categorias',
      route: '/editor',
      icon: 'format_list_bulleted',
    },
    {
      text: 'Rede',
      route: '/network',
      icon: 'share',
    },
  ];

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  constructor(public router: Router, public authService: AuthService, private dialog: MatDialog) { }

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

}
