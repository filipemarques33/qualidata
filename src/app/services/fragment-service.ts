import { EventEmitter, Injectable } from "@angular/core";
import { FragmentRepository } from '../storage/firestore/FragmentRepository';
import Project from "../data/Project";
import Source from "../data/Source";
import Code from "../data/Code";
import Fragment from "../data/Fragment"
import { AuthService } from "./auth-service";
import { ProjectService } from "./project-service";
import { SourceService } from "./source-service";
import { CodeService } from "./code-service";
import tinymce, { Editor } from "tinymce/tinymce";
import { CategoryService } from "./category-service";

@Injectable({
  providedIn: 'root'
})
export class FragmentService {

  public loadingFragments = new EventEmitter<boolean>();
  public fragments: Fragment[] = [];
  public areFragmentsLoaded = false;

  constructor (
    private fragmentRepository: FragmentRepository,
    private authService: AuthService,
    private categoryService: CategoryService,
    private sourceService: SourceService,
    private codeService: CodeService
  ) {
    this.authService.userLogEvent.subscribe(eventType => {
      if (eventType === 'logout') {
        this.logoutUser();
      }
    });
  }

  buildFragment(activeEditor: Editor, source: string) {

    let document = activeEditor.getDoc()
    let content = activeEditor.selection.getContent({format: 'text'})
    let selection = activeEditor.selection.getSel()
    let range = selection.getRangeAt(0)

    let rangeContent = {
      startXPath: this.makeXPath(document, range.startContainer, ''),
      startOffset: range.startOffset,
      endXPath: this.makeXPath(document, range.endContainer, ''),
      endOffset: range.endOffset,
    }

    var fragment = new Fragment('', source, rangeContent, content, [])
    return fragment

  }

  makeXPath (document, node, currentPath) {
    switch (node.nodeType) {
      case 3:
      case 4:
        return this.makeXPath(document, node.parentNode, 'text()[' + (document.evaluate('preceding-sibling::text()', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']');
      case 1:
        return this.makeXPath(document, node.parentNode, node.nodeName + '[' + (document.evaluate('preceding-sibling::' + node.nodeName, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']' + (currentPath ? '/' + currentPath : ''));
      case 9:
        return '/' + currentPath;
      default:
        return '';
    }
  }

  restoreFragmentRange(document: Document, fragment: Fragment): Range {
    let range = new Range()
    let rangeContent = fragment.range
    range.setStart(document.evaluate(rangeContent.startXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(rangeContent.startOffset));
    range.setEnd(document.evaluate(rangeContent.endXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(rangeContent.endOffset));
    return range
  }

  async loadFragmentsBySource(source: Source) {
    this.loadingFragments.emit(true);
    if (this.authService.user && !this.areFragmentsLoaded) {
      this.fragments = await this.getFragmentsByIds(source.fragments);
      this.areFragmentsLoaded = true;
    }
    this.loadingFragments.emit(true);
  }

  async getFragmentsByIds(ids: string[]) {
    return await this.fragmentRepository.getByIds(ids);
  }

  subscribeToAll() {
    return this.fragmentRepository.subscribeToAll()
  }

  async saveFragment(fragment: Fragment, project: Project, source: Source, codes: Code[]){
    for (let code of codes) {
      if (code.id === '') {
        var codeRef = await this.codeService.saveCode(code, project.id)
        code.id = codeRef
      }
      fragment.codes.push(code.id)
    }
    var fragRef = await this.fragmentRepository.saveFragment(fragment)
    await this.sourceService.addFragment(source, fragRef)
    for (let code of codes) {
      await this.codeService.addFragment(code, fragRef)
    }
  }

  private logoutUser() {
    this.areFragmentsLoaded = false;
    this.fragments = [];
  }

  drawFragments(editor: Editor, container: HTMLElement, fragments: Fragment[]){
    let doc = editor.getDoc()
    this.removeAllChildren(container)

    fragments = fragments.map(
      fragment => {
        fragment.rangeObject = this.restoreFragmentRange(doc, fragment)
        fragment.boundingBox = fragment.rangeObject.getBoundingClientRect()
        return fragment
      }).sort((a, b) => b.boundingBox.height - a.boundingBox.height)

    var placedFragments: DOMRect[] = []

    for (let fragment of fragments) {
      let fragmentBox = fragment.boundingBox
      let fragmentRect = new DOMRect(
        16,
        editor.getWin().pageYOffset + fragmentBox.y,
        16,
        fragmentBox.height
      )

      for (let placed of placedFragments) {
        if (this.overlaps(fragmentRect, placed)) {
          fragmentRect.x += 24
        }
      }

      var iDiv = document.createElement('div');
      container.appendChild(iDiv)

      iDiv.style.position = 'absolute'
      iDiv.style.backgroundColor = '#0000FF25'
      iDiv.style.borderRadius = '8px'
      iDiv.style.top = fragmentRect.y + 'px'
      iDiv.style.left = fragmentRect.x + 'px';
      iDiv.style.height = fragmentRect.height + 'px'
      iDiv.style.width = fragmentRect.width + 'px';
      iDiv.style.visibility = 'visible';

      let service = this
      iDiv.addEventListener('mouseover', function(event) {
        service.showSelection(editor, fragment)
      })
      iDiv.addEventListener('mouseout', function(event) {
        editor.selection.getSel().removeRange(fragment.rangeObject)
      })
      iDiv.addEventListener('click', function(event) {
        console.log('click')
      })
      placedFragments.push(fragmentRect)
    }
  }

  showSelection(editor: Editor, fragment: Fragment) {
    //fragment.rangeObject = this.restoreFragmentRange(tinymce.activeEditor.getDoc(), fragment)
    var selection = editor.selection.getSel();
    selection.removeAllRanges();
    selection.addRange(fragment.rangeObject);
  }

  //auxiliary methods
  removeAllChildren(parent: Node){
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }

  overlaps(rect1: DOMRect, rect2: DOMRect) {
    let horizontalBounds = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
    let verticalBounds = rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
    return horizontalBounds && verticalBounds
  }

}
