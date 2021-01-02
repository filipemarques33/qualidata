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
  { path: 'sources', children: [
    { path: '', pathMatch: 'full', component: SourcesComponent },
    { path: ':sourceId/edit', component: ComposeComponent},
    { path: 'new', component: ComposeComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
