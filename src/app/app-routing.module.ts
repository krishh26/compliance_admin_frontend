import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'line-manager', pathMatch: 'full' },
  { path: 'line-manager', loadChildren: () => import('./modules/line-manger/line-manger.module').then(m => m.LineMangerModule) },
  { path: 'employee', loadChildren: () => import('./modules/employee/employee.module').then(m => m.EmployeeModule) },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
