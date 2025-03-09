import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubPoliciesListComponent } from './sub-policies-list/sub-policies-list.component';
import { SharedModule } from '../../utility/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin/home/home.component';
import { UploadSubPoliciesComponent } from './upload-sub-policies/upload-sub-policies.component';
import { SubPoliciesSettingComponent } from './sub-policies-setting/sub-policies-setting.component';
import { QuestionListComponent } from './question-list/question-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'policies-list', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'sub-policies-list/:id', component: SubPoliciesListComponent },
      { path: 'upload-sub-policy/:id', component: UploadSubPoliciesComponent },
      {
        path: 'setting-sub-policies/:id',
        component: SubPoliciesSettingComponent,
      },
      {
        path: 'question-list',
        component: QuestionListComponent,
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
  declarations: [
    SubPoliciesListComponent,
    UploadSubPoliciesComponent,
    SubPoliciesSettingComponent,
    QuestionListComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
})
export class SubPoliciesModule {}
