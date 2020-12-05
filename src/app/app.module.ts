import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { ImportsModule } from 'src/app/common/imports.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ComposeComponent } from './components/compose/compose.component';
import { NavBarComponent } from './components/navbar/navbar.component';
import { NetworkComponent } from './components/network/network.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NetworkService } from './services/network-service';

@NgModule({
  declarations: [
    AppComponent,
    ComposeComponent,
    NavBarComponent,
    NetworkComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    EditorModule,
    ImportsModule,
    NgbModule
  ],
  providers: [
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    NetworkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
