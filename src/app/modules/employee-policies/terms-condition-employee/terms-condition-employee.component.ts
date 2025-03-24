import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-terms-condition-employee',
  templateUrl: './terms-condition-employee.component.html',
  styleUrls: ['./terms-condition-employee.component.css']
})
export class TermsConditionEmployeeComponent {
  subPolicyID!: string;
  subPolicyData!: any;
  safeDescription!: SafeHtml;
  acceptTerms: boolean = false;
  latitude!: number;
  longitude!: number;
  ipAddress!: string;
  loginUser: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService
  ) {
    this.loginUser = this.localStorageService.getLogger();
    this.route.paramMap.subscribe((params) => {
      this.subPolicyID = String(params.get('id'));
      if (this.subPolicyID) {
        this.getSubPolicyDetails();
      }
    });
    this.getCurrentLocation();
    this.getIpAddress();
  }

  getSubPolicyDetails() {
    this.spinner.show();
    this.subPoliciesService.getPolicyDetails(this.subPolicyID, { employeeId: this.loginUser?._id }).subscribe((response) => {
      this.subPolicyData = response?.data?.length > 0 ? response?.data?.[0] : response?.data;
      if (this.subPolicyData?.description) {
        this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.subPolicyData.description);
      }
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }, (error) => {
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
      this.notificationService.showError(error?.error?.message || 'Something went wrong!');
    }
    );
  }

  submitTerms() {
    if (!this.acceptTerms) {
      return this.notificationService.showError('Please select acceptance checkbox !');
    }
    this.acceptTermsAndCondition();
  }

  openMap(location: string): void {
    if (!location) return;

    const [lat, lon] = location.split(',').map(coord => coord.trim());

    if (lat && lon) {
      const url = `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(url, '_blank');
    } else {
      console.error('Invalid location format');
    }
  }


  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  acceptTermsAndCondition() {
    Swal.fire({
      title: 'Confirmation',
      text: `I have read all the instructions carefully and have understood them.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#007C00',
      cancelButtonColor: '#F7454A',
      confirmButtonText: 'Accept',
    }).then((result: any) => {
      if (result?.value) {
        const payload = {
          employeeId: this.loginUser?._id,
          subPolicyId: this.subPolicyID,
          ipAddress: "198.0.0.1",
          location: `${this.latitude},${this.longitude}`
        };
        this.subPoliciesService.acceptTerms(payload).subscribe(
          (response) => {
            if (response?.statusCode == 200 || response?.statusCode == 201) {
              this.notificationService.showSuccess('Accept Successfully');
              this.getSubPolicyDetails();
            } else {
              this.notificationService.showError("Please retry !");
            }
          }, (error) => {
            this.notificationService.showError(error?.error?.message || 'Something went wrong!');
          }
        );
      } else {
        this.acceptTerms = false;
      }
    });
  }

  getIpAddress() {
    this.subPoliciesService.getCurrentIp().subscribe({
      next: (response) => {
        this.ipAddress = response?.ip;
      },
      error: (err) => {
        console.error('Failed to get IP:', err);
      },
    });
  }
}
