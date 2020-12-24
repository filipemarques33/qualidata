import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import CanvasEdge from '../../data/Canvas/CanvasEdge';
import { NetworkService } from '../../services/network-service';

@Component({
  selector: 'app-details-sidebar',
  templateUrl: 'details-sidebar.component.html',
  styleUrls: ['details-sidebar.component.scss']
})
export class DetailsSidebar {

  @Input() inputVertex?: VertexCategory;
  @Input() inputEdge?: CanvasEdge;

  @Output() closeSidebarEvent = new EventEmitter();

  constructor(
    public networkService: NetworkService
  ) {}

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }
}