import { Component, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkComponent implements AfterViewInit {

  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('sidenav') sidenavRef: MatSidenav;

  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;

    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight - 65;
    this.canvas.style.height = '100%';

    this.canvasContext = this.canvas.getContext("2d");
    this.canvasContext.fillStyle = "gray";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

  }

  @HostListener('window:resize')
  onResize() {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight - 65;
    this.canvas.style.height = '100%';

    this.canvasContext.fillStyle = "gray";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

}
