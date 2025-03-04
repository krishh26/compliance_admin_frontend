import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './modules/admin/admin.module';
import { LoginComponent } from './modules/auth/login/login.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { PoliciesModule } from './modules/policies/policies.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for Toastr
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './utility/shared/shared.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { APIInterceptor } from './utility/interceptor/ApiInterceptor';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    PoliciesModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // Required for Toastr
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false,
    }),
    SharedModule
  ],
  // providers: [ { provide: LocationStrategy, useClass: HashLocationStrategy },
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: APIInterceptor,
  //     multi: true
  //   }],
  bootstrap: [AppComponent],
})
export class AppModule { }
