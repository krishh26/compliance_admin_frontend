import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHomeComponent } from './employee-home/employee-home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: EmployeeHomeComponent }
];

@NgModule({
  declarations: [
    EmployeeHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EmployeeModule { }
