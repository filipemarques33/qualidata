import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) snavRef: MatSidenav;

  constructor() { }

  ngOnInit(): void {
  }

}
