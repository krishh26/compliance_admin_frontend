import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  showLoader: boolean = false;
  submitted = false;
  token!: any;
  loginUser: any;
  constructor(
    private fb: FormBuilder,
    private authServiceService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
     private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
    this.changeForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.token = this.loginUser?.email
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.changeForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    if (
      this.changeForm.value.password != this.changeForm.value.confirmPassword
    ) {
      this.notificationService.showError(
        'Password and Confirm Password do not match'
      );
      return;
    }
    if (this.changeForm.valid) {
      this.showLoader = true;
      this.authServiceService.createPassowrd({ password: this.changeForm.value.password }, this.token).subscribe(
        (response) => {
          this.showLoader = false;
          this.router.navigate(['/login']);
          this.notificationService.showSuccess(response?.message || 'Password changed successfully');
        },
        (error) => {
          this.showLoader = false;
          console.log('this is error', error);
          this.notificationService.showError(error?.error?.message || 'Something went wrong!');
        }
      );
    }
  }
}
