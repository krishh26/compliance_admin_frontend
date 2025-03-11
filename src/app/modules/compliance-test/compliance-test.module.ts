import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../admin/home/home.component';
import { OutstandingComponent } from './outstanding/outstanding.component';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { CompletedTestComponent } from './completed-test/completed-test.component';
import { ExamIntructionComponent } from './exam-intruction/exam-intruction.component';

const routes: Routes = [
  { path: '', redirectTo: 'outstanding', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'outstanding',
        component: OutstandingComponent,
      },
      {
        path: 'completed',
        component: CompletedTestComponent,
      },
      {
        path: 'instruction',
        component: ExamIntructionComponent,
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
    OutstandingComponent,
    CompletedTestComponent,
    ExamIntructionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ComplianceTestModule { }
