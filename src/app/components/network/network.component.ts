import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, ViewChild, ElementRef, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import CanvasCategory from 'src/app/data/Canvas/CanvasCategory';
import { NetworkService } from "../../services/network-service";

interface VertexNode {
  name: string;
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

  treeControl = new NestedTreeControl<VertexNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VertexNode>();

  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  sidebarVertexTree: VertexNode[] = [];

  sidenavHover = false;
  isNetworkLoaded = false;

  constructor(public networkService: NetworkService) { }

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.networkService.setupCanvasStage(this.canvas);
    this.setupTree();
    this.isNetworkLoaded = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.networkService.redraw();
  }

  hasChildren(_: any, node: VertexNode) {return !!node.children && node.children.length > 0}

  private setupTree() {
    this.sidebarVertexTree = this.networkService.network.canvasCategories.map(canvasCategory => {
      return this.getCategoryTree(canvasCategory);
    });

    this.sidebarVertexTree.push(...this.networkService.network.canvasCodes.map(canvasCode => ({
      name: canvasCode.name
    })));

    this.dataSource.data = this.sidebarVertexTree;
  }

  private getCategoryTree(canvasCategory: CanvasCategory): VertexNode {
    let children = canvasCategory.categories.map(subCategory => this.getCategoryTree(subCategory));
    children.push(...canvasCategory.codes.map(canvasCode => ({name: canvasCode.name})));
    return {
      name: canvasCategory.name,
      children: children
    }
  }

}
