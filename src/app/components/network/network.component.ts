import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, ElementRef, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import CanvasCategory from 'src/app/data/Canvas/CanvasCategory';
import VertexCategory from 'src/app/data/Canvas/VertexCategory';
import { NetworkService } from "../../services/network-service";
import { RelationshipDialog } from './relationship-dialog/relationship-dialog.component';

interface VertexNode {
  id: number;
  name: string;
  color: string;
  textColor: string;
  type: string;
  children?: VertexNode[];
}

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetworkComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('sidenav') sidenavRef: MatSidenav;
  @ViewChild('details') detailsRef: MatSidenav;
  @ViewChild('dragger') draggerRef: ElementRef<HTMLDivElement>;
  @ViewChild('trigger') trigger: ElementRef<HTMLDivElement>;
  @ViewChild('matTrigger') matTrigger: MatMenuTrigger;

  treeControl = new NestedTreeControl<VertexNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VertexNode>();

  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  sidebarVertexTree: VertexNode[] = [];
  dragImg: HTMLImageElement;
  selectedDetailsNode: VertexCategory;
  mousePosition = {
    x: 0,
    y: 0
  };

  sidenavHover = false;
  isNetworkLoaded = false;

  constructor(public networkService: NetworkService, public relationshipDialog: MatDialog) {}

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.networkService.setupCanvasStage(this.canvas, (event: MouseEvent, vertex: VertexCategory) => this.openDetailsMenu(event, vertex));
    this.setupTree();
    this.isNetworkLoaded = true;

    this.dragImg = new Image(0,0);
    this.dragImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    }, false);
  }

  @HostListener('window:resize')
  onResize() {
    this.networkService.redraw();
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
    if (event.x < this.sidenavRef._getWidth()) {
      this.draggerRef.nativeElement.style.filter = "brightness(70%)";
      this.draggerRef.nativeElement.style.opacity = "0.6";
    } else {
      this.draggerRef.nativeElement.style.opacity = "1";
      this.draggerRef.nativeElement.style.filter = "brightness(100%)";
    }
    if (event.y !== 0) this.draggerRef.nativeElement.style.top = event.y - this.draggerRef.nativeElement.clientHeight/2 + 'px';
    if (event.x !== 0) this.draggerRef.nativeElement.style.left = event.x - this.draggerRef.nativeElement.clientWidth/2 + 'px';
  }

  hideDragElement(event: DragEvent, node: VertexNode) {
    this.draggerRef.nativeElement.style.display = 'none';

    if (event.x > this.sidenavRef._getWidth()) this.networkService.network.renderVertex(node.type, node.id, event.x, event.y - 60);
  }

  openDetailsMenu(event: MouseEvent, vertex: VertexCategory) {
    this.trigger.nativeElement.style.left = event.clientX + 5 + 'px';
    this.trigger.nativeElement.style.top = event.clientY + 5 + 'px';
    this.matTrigger.openMenu();
    this.selectedDetailsNode = vertex;
  }

  openDetailsSidenav() {
    this.detailsRef.open();
  }

  openRelationshipDialog() {
    this.relationshipDialog.open(RelationshipDialog, {
      data: {
        vertex: this.selectedDetailsNode
      }
    })
  }

  filteredVertices(currentVertex: VertexCategory) {
    return this.networkService.network.visibleVertices.filter(vertex => vertex.id !== currentVertex.id);
  }

  private setupTree() {
    this.sidebarVertexTree = this.networkService.network.canvasCategories.map(canvasCategory => {
      return this.getCategoryTree(canvasCategory);
    });

    this.sidebarVertexTree.push(...this.networkService.network.canvasCodes.map(canvasCode => ({
      id: canvasCode.id,
      name: canvasCode.name,
      color: canvasCode.color,
      textColor: canvasCode.vertex.textColor,
      type: 'Code'
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
      children: children,
      type: 'Category'
    }
  }

}
