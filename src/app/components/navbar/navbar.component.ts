import { AfterViewInit, Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service';
import { NetworkService } from 'src/app/services/network-service';
import { UserLoginDialog } from '../user-login/user-login.component';
import { MatSidenav } from '@angular/material/sidenav';
import Project from 'src/app/data/Project';
import { DatabaseService } from 'src/app/services/database-service';
import { Subscription } from 'rxjs';

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

  projectId = '1'
  navItems: NavItem[] = [
    {
      text: 'Fontes',
      route: 'projects/'+ this.projectId +'/sources',
      icon: 'description',
    },
    {
      text: 'Categorias',
      route: 'projects/'+ this.projectId +'/categories',
      icon: 'format_list_bulleted',
    },
    {
      text: 'Rede',
      route: 'projects/'+ this.projectId +'/network',
      icon: 'share',
    },
  ];

  @ViewChild('snav', { static: false }) snavRef: MatSidenav;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public authService: AuthService,
    public databaseService: DatabaseService,
    private dialog: MatDialog,
    private networkService: NetworkService
  ) { }


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
