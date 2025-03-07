import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset', component: ResetPasswordComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'policies',
    loadChildren: () =>
      import('./modules/policies/policies.module').then(
        (m) => m.PoliciesModule
      ),
  },
  {
    path: 'sub-policies',
    loadChildren: () =>
      import('./modules/sub-policies/sub-policies.module').then(
        (m) => m.SubPoliciesModule
      ),
  },
  {
    path: 'employee-policies',
    loadChildren: () =>
      import('./modules/employee-policies/employee-policies.module').then(
        (m) => m.EmployeePoliciesModule
      ),
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
