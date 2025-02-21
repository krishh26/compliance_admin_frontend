import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeDetailsCompletedComponent } from './employee-details-completed/employee-details-completed.component';
import { EmployeeDetailsOutstandingComponent } from './employee-details-outstanding/employee-details-outstanding.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

const routes: Routes = [
  { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'employee-details-completed', component: EmployeeDetailsCompletedComponent },
      { path: 'employee-details-outstanding', component: EmployeeDetailsOutstandingComponent },
    ]
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: ""
  }
];

@NgModule({
  declarations: [
    EmployeeListComponent,
    HomeComponent,
    EmployeeDetailsCompletedComponent,
    EmployeeDetailsOutstandingComponent,
    AddEmployeeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }
