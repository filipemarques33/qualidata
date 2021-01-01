import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComposeComponent } from './components/compose/compose.component';
import { NetworkComponent } from './components/network/network.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SourcesComponent } from './components/sources/sources.component';

const routes: Routes = [
  { path: '', redirectTo: '/editor', pathMatch: 'full' },
  { path: 'editor', component: ComposeComponent },
  { path: 'network', component: NetworkComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'sources', component: SourcesComponent },
  { path: '**', redirectTo: 'editor' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
