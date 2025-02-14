import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineManagerEmployeeComponent } from './line-manager-employee/line-manager-employee.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LineManagerEmployeeComponent }
];

@NgModule({
  declarations: [
    LineManagerEmployeeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LineMangerModule { }
