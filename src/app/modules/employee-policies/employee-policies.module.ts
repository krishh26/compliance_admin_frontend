import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubPoliciesListComponent } from './sub-policies-list/sub-policies-list.component';
import { SharedModule } from '../../utility/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin/home/home.component';
import { PoliciesListComponent } from './policies-list/policies-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'employee-policies-list', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'employee-policies-list', component: PoliciesListComponent },
      {
        path: 'employee-sub-policies-list/:id',
        component: SubPoliciesListComponent,
      },
    ],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [PoliciesListComponent, SubPoliciesListComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class EmployeePoliciesModule {}
