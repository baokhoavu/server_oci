import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Step01Component } from './step-01/step-01.component';
import { Step02Component } from './step-02/step-02.component';
import { Step03Component } from './step-03/step-03.component';
import { Step05Component } from './step-05/step-05.component';
import { Step06Component } from './step-06/step-06.component';
import { Step07Component } from './step-07/step-07.component';
import { Step08Component } from './step-08/step-08.component';

const routes: Routes = [
  { path: 'step-01', component: Step01Component },
  { path: 'step-02', component: Step02Component, data: { page: 'step-02' } },
  { path: 'step-03', component: Step03Component, data: { page: 'step-03' } },
  { path: 'step-05', component: Step05Component, data: { page: 'step-05' } },
  { path: 'step-06', component: Step06Component, data: { page: 'step-06' } },
  { path: 'step-07', component: Step07Component, data: { page: 'step-07' } },
  { path: 'step-08', component: Step08Component, data: { page: 'step-08' } },
  { path: '', redirectTo: '/step-01', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
