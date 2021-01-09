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
import { Editor } from "tinymce/tinymce";

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
    private projectService: ProjectService,
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

}
