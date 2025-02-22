import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  showPassword = false;
  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authServiceService: AuthServiceService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], //Validators.minLength(6)
    });
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    if (this.loginForm.valid) {
      this.showLoader = true;
      this.authServiceService.loginUser(this.loginForm.value).subscribe(
        (response) => {
          this.showLoader = false;
          this.router.navigate(['/admin']);
          // this.notificationService.showSuccess(response?.message || 'User login successfully');
        },
        (error) => {
          this.showLoader = false;
          console.log('this is error', error);
          // this.notificationService.showError(error?.error?.message || 'Something went wrong!');
        }
      );
    }
  }

  togglePassword() {
    console.log('this is called');
    this.showPassword = !this.showPassword;
  }
}
