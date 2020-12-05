import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavBarComponent implements OnInit, AfterViewInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

}
