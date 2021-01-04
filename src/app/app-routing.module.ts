import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComposeComponent } from './components/compose/compose.component';
import { EditSourceComponent } from './components/edit-source/edit-source.component';
import { NetworkComponent } from './components/network/network.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SourcesComponent } from './components/sources/sources.component';
import { CategoriesComponent } from "./components/categories/categories.component";

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'categories', children:[
    { path: '', pathMatch: 'full', component: CategoriesComponent },
  ]},
  { path: 'network', component: NetworkComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'sources', children: [
    { path: '', pathMatch: 'full', component: SourcesComponent },
    { path: ':sourceId/edit', component: EditSourceComponent},
    { path: 'new', component: ComposeComponent},
  ]},
  { path: '**', redirectTo: '/sources' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
