import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EmployeeDetailsCompletedComponent } from './employee-details-completed/employee-details-completed.component';
import { EmployeeDetailsOutstandingComponent } from './employee-details-outstanding/employee-details-outstanding.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EmployeeProfileComponent } from './employee-profile/employee-profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'employee-list', pathMatch: 'full' },
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'employee-list', component: EmployeeListComponent },
      { path: 'add-employee', component: AddEmployeeComponent },
      { path: 'edit-employee/:id', component: AddEmployeeComponent },
      {
        path: 'employee-details-completed/:id',
        component: EmployeeDetailsCompletedComponent,
      },
      {
        path: 'employee-details-outstanding/:id',
        component: EmployeeDetailsOutstandingComponent,
      },
      {
        path: 'employee-profile',
        component: EmployeeProfileComponent,
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
    EmployeeListComponent,
    HomeComponent,
    EmployeeDetailsCompletedComponent,
    EmployeeDetailsOutstandingComponent,
    AddEmployeeComponent,
    EmployeeProfileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule { }
