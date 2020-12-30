import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ImportsModule } from 'src/app/common/imports.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComposeComponent } from './components/compose/compose.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { NetworkComponent } from './components/network/network.component';
import { RelationshipDialog } from "./components/network/relationship-dialog/relationship-dialog.component";
import { DetailsSidebar } from "./components/details-sidebar/details-sidebar.component";
import { TreeView } from "./components/tree-view/tree-view.component";

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkService } from './services/network-service';
import { NewProjectDialogComponent } from './components/projects/new-project-dialog/new-project-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ComposeComponent,
    NavBarComponent,
    NetworkComponent,
    RelationshipDialog,
    DetailsSidebar,
    TreeView,
    ProjectsComponent,
    NewProjectDialogComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EditorModule,
    ImportsModule,
    NgbModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
