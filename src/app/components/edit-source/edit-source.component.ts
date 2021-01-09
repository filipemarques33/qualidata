import { Component, Directive, OnInit } from '@angular/core';
import Source from 'src/app/data/Source';
import Fragment from 'src/app/data/Fragment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { NetworkService } from 'src/app/services/network-service';
import { SourceService } from 'src/app/services/source-service';
import { FragmentService } from 'src/app/services/fragment-service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaggingDialogComponent } from './tagging-dialog/tagging-dialog.component';
import tinymce from 'tinymce';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.scss']
})
export class EditSourceComponent implements OnInit {

  currentProjectId: string = ''

  currentSourceId: string = ''
  currentSource: Source = new Source('', '', '', []);
  fragments: Fragment[]

  fragmentSubscription: Subscription

  tinyMceConfig: any;

  constructor(
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
    private sourceService: SourceService,
    private fragmentService: FragmentService,
    private taggingDialogRef: MatDialog,
  ) { }

  ngOnInit(): void {
    this.currentProjectId = this.route.snapshot.paramMap.get('projId');
    this.getSourceContent();
    this.configureEditor();
    this.currentSourceId = this.route.snapshot.paramMap.get('sourceId');
    this.fragmentSubscription = this.fragmentService.subscribeToAll().subscribe(
      fragments => {
        this.fragments = fragments.filter(fragment => fragment.sourceId == this.currentSourceId)
      }
    )

  }

  ngOnDestroy() {
    this.fragmentSubscription.unsubscribe()
  }

  async getSourceContent() {
    const sourceId = this.route.snapshot.paramMap.get('sourceId');
    this.currentSource = await this.sourceService.getSourceById(sourceId);
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
        'help wordcount'
      ],
      toolbar:[
        'undo redo | formatselect | bold italic | \
        alignleft aligncenter alignright alignjustify \
        bullist numlist outdent indent | help | tagging',
      ],
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
      )
    } else {
      alert('Selecione um trecho de texto para continuar')
    }
  }

  showSelection(fragment: Fragment) {
    let document = tinymce.activeEditor.getDoc()
    let range = this.fragmentService.restoreFragmentRange(document, fragment)

    var selection = tinymce.activeEditor.selection.getSel();
    selection.removeAllRanges();

    selection.addRange(range);
  }

}
