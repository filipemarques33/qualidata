import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, ElementRef, ViewEncapsulation, HostListener, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import CanvasCategory from '../../data/Canvas/CanvasCategory';
import VertexCategory from '../../data/Canvas/VertexCategory';
import CanvasEdge from '../../data/Canvas/CanvasEdge';
import { NetworkService } from "../../services/network-service";

interface VertexNode {
  id: number;
  name: string;
  color: string;
  textColor: string;
  children?: VertexNode[];
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TreeView implements OnInit {

  @ViewChild('dragger') draggerRef: ElementRef<HTMLDivElement>;

  @Input() sidenav: MatSidenav;
  @Input() showHandle: boolean;

  treeControl = new NestedTreeControl<VertexNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VertexNode>();

  sidebarVertexTree: VertexNode[] = [];
  dragImg: HTMLImageElement;
  mousePosition = {
    x: 0,
    y: 0
  };

  isNetworkLoading = false;

  constructor(public networkService: NetworkService) {}

  ngOnInit(): void {
    this.networkService.structuresUpdated.subscribe(() => {
      this.isNetworkLoading = true;
      this.setupTree();
      this.isNetworkLoading = false;
    });
    this.dragImg = new Image(0,0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  }

  hasChildren(_: any, node: VertexNode) {return !!node.children && node.children.length > 0}

  hideGhost(event: DragEvent, node: VertexNode) {
    event.dataTransfer.setDragImage(this.dragImg, 0, 0);
    this.draggerRef.nativeElement.style.background = node.color;
    this.draggerRef.nativeElement.style.color = node.textColor;
    this.draggerRef.nativeElement.innerHTML = node.name;
    this.draggerRef.nativeElement.style.display = 'block';
  }

  changeDragElement(event: DragEvent) {
    event.preventDefault();
    if (event.x < this.sidenav._getWidth()) {
      this.draggerRef.nativeElement.style.filter = "brightness(70%)";
      this.draggerRef.nativeElement.style.opacity = "0.6";
    } else {
      this.draggerRef.nativeElement.style.opacity = "1";
      this.draggerRef.nativeElement.style.filter = "brightness(100%)";
    }
    if (event.y !== 0) this.draggerRef.nativeElement.style.top = event.y - 60 - this.draggerRef.nativeElement.clientHeight/2 + 'px';
    if (event.x !== 0) this.draggerRef.nativeElement.style.left = event.x - this.draggerRef.nativeElement.clientWidth/2 + 'px';
  }

  hideDragElement(event: DragEvent, node: VertexNode) {
    this.draggerRef.nativeElement.style.display = 'none';

    if (event.x > this.sidenav._getWidth()) this.networkService.network.renderVertex(node.id, event.x, event.y - 60);
  }

  private setupTree() {
    this.sidebarVertexTree = this.networkService.network.canvasCategories.map(canvasCategory => {
      return this.getCategoryTree(canvasCategory);
    });

    this.sidebarVertexTree.push(...this.networkService.network.canvasCodes.map(canvasCode => ({
      id: canvasCode.id,
      name: canvasCode.name,
      color: canvasCode.color,
      textColor: canvasCode.vertex.textColor
    })));

    this.dataSource.data = this.sidebarVertexTree;
  }

  private getCategoryTree(canvasCategory: CanvasCategory): VertexNode {
    let children = canvasCategory.categories.map(subCategory => this.getCategoryTree(subCategory));
    children.push(...canvasCategory.codes.map(canvasCode => ({
      id: canvasCode.id,
      name: canvasCode.name,
      color: canvasCode.color,
      textColor: canvasCode.vertex.textColor,
      type: 'Code'
    })));
    return {
      id: canvasCategory.id,
      name: canvasCategory.name,
      color: canvasCategory.color,
      textColor: canvasCategory.vertex.textColor,
      children: children
    }
  }

}
