import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ColorPickerModule, ColorPickerDirective } from 'ngx-color-picker';

import { ImportsModule } from 'src/app/common/imports.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComposeComponent } from './components/compose/compose.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { NetworkComponent } from './components/network/network.component';
import { RelationshipDialog } from "./components/network/relationship-dialog/relationship-dialog.component";
import { DetailsSidebar } from "./components/details-sidebar/details-sidebar.component";
import { TreeView } from "./components/tree-view/tree-view.component";
import { UserLoginDialog } from './components/user-login/user-login.component';
import { ProjectsComponent } from './components/projects/projects.component';

import { NetworkService } from './services/network-service';
import { DatabaseService } from './services/database-service';
import { AuthService } from './services/auth-service';

import { environment } from 'src/environments/environment';
import { SourcesComponent } from './components/sources/sources.component';
import { EditSourceComponent } from './components/edit-source/edit-source.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NewCategoryDialogComponent } from './components/categories/new-category-dialog/new-category-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ComposeComponent,
    NavBarComponent,
    NetworkComponent,
    RelationshipDialog,
    DetailsSidebar,
    TreeView,
    UserLoginDialog,
    ProjectsComponent,
    SourcesComponent,
    EditSourceComponent,
    CategoriesComponent,
    NewCategoryDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EditorModule,
    ImportsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ColorPickerModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    NetworkService,
    DatabaseService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
