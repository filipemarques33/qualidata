import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComposeComponent } from './components/compose/compose.component';
import { NetworkComponent } from './components/network/network.component';

const routes: Routes = [
  { path: '', component: ComposeComponent },
  { path: 'network', component: NetworkComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
