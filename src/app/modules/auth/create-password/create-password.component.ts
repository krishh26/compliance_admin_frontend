import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth/auth-service.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.css']
})
export class CreatePasswordComponent {
  createForm: FormGroup;
  showLoader: boolean = false;
  submitted = false;
  token!: any;

  constructor(
    private fb: FormBuilder,
    private authServiceService: AuthServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.createForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', this.token); // Debugging purpose
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.createForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.createForm.invalid) {
      return;
    }
    if (
      this.createForm.value.password != this.createForm.value.confirmPassword
    ) {
      this.notificationService.showError(
        'Password and Confirm Password do not match'
      );
      return;
    }
    if (this.createForm.valid) {
      this.showLoader = true;
      this.authServiceService.createPassowrd({ password: this.createForm.value.password }, this.token).subscribe(
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
