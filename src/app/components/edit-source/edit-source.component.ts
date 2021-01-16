import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import Source from 'src/app/data/Source';
import Fragment from 'src/app/data/Fragment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SourceService } from 'src/app/services/source-service';
import { FragmentService } from 'src/app/services/fragment-service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaggingDialogComponent } from './tagging-dialog/tagging-dialog.component';
import tinymce from 'tinymce';
import { Subscription } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';
import { CodeService } from 'src/app/services/code-service';
import { ProjectService } from 'src/app/services/project-service';
import Code from 'src/app/data/Code';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit, OnDestroy {

  currentProjectId: string = ''

  currentSourceId: string = ''
  currentSource: Source = new Source('', '', '', []);
  fragments: Fragment[]

  availableCodes: Code[] = []
  codeSubscription: Subscription

  tinyMceConfig: any;

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private sourceService: SourceService,
    private fragmentService: FragmentService,
    private codeService: CodeService,
    private projectService: ProjectService,
    private taggingDialogRef: MatDialog,
  ) { }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.paramMap.get('projId');
    this.getPageContent();
    this.configureEditor();
  }

  ngOnDestroy() {
    //this.fragmentSubscription.unsubscribe()
  }

  async getPageContent() {
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    this.currentSource = await this.sourceService.getSourceById(sourceId);
    this.fragments = await this.fragmentService.getFragmentsByIds(this.currentSource.fragments)
    await this.codeService.loadUserCodes()
    this.availableCodes = this.codeService.codes
    this.drawFragmentsPanel()
  }

  configureEditor(){
    let component = this
    this.tinyMceConfig = {
      base_url: '/tinymce',
      suffix: '.min',
      height: 500,
      menubar: false,
      placeholder: 'Comece a escrever seu documento aqui',
      plugins: [
        'advlist autolink lists link image charmap print',
        'preview anchor searchreplace visualblocks code',
        'fullscreen insertdatetime media table paste',
        'help wordcount quickbars'
      ],
      toolbar: false,
      quickbars_selection_toolbar: 'bold italic underline | formatselect | blockquote quicklink | tagging',
      contextmenu: 'undo redo | inserttable | cell row column deletetable | help',
      setup: function(editor) {
        editor.ui.registry.addButton('tagging', {
          icon: 'permanent-pen',
          text: 'Tag fragment',
          onAction: function (_) {
            component.tagFragment()
          }
        });
      }
    }
  }

  updateFile(): void {
    this.sourceService.updateContent(this.currentSource).then(
      () => {
        this.snackbar.open('Documento atualizado', null, {
          duration: 2000,
        })
      }
    )
  }

  verifyFields() {
    return (this.currentSource.content)
  }

  tagFragment() {
    if (tinymce.activeEditor.selection.getContent() != '') {
      var fragment = this.fragmentService.buildFragment(tinymce.activeEditor, this.currentSource.id)
      this.taggingDialogRef.open(
        TaggingDialogComponent, {
          data: {
            source: this.currentSource,
            fragment: fragment
          },
          autoFocus: false
        }
      ).afterClosed().subscribe(
        async (success) => {
          if (success) {
            this.getPageContent()
          }
        }
      )
    } else {
      alert('Selecione um trecho de texto para continuar')
    }
  }

  drawFragmentsPanel() {
    let container = document.getElementById("fragmentlist")
    container.style.height = tinymce.activeEditor.getBody().scrollHeight + "px"
    this.fragmentService.drawFragments(tinymce.activeEditor, container, this.fragments, this.availableCodes)
    this.syncScrolls()
  }

  syncScrolls() {
    var leftDiv = tinymce.editors[0].getWin()
    var rightDiv = document.getElementById("sidepanel");
    leftDiv.onscroll = function() {
      rightDiv.scrollTop = leftDiv.scrollY
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.drawFragmentsPanel();
  }

}
