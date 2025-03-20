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

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private subPoliciesService: SubPoliciesService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) {
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
    this.subPoliciesService.getPolicyDetails(this.subPolicyID).subscribe((response) => {
      this.subPolicyData = response?.data;
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
    console.log(this.acceptTerms);
    if (!this.acceptTerms) {
      return this.notificationService.showError('Please select acceptance checkbox !');
    }
    this.acceptTermsAndCondition();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Latitude:', this.latitude);
          console.log('Longitude:', this.longitude);
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
        console.log("kdgjkfghsdjfh", result.value);
        const data = this.subPoliciesService.getCurrentIp()
        console.log('asdasda', data);
        // const payload = { id: id };
        // this.subPoliciesService.deleteQuestion(payload).subscribe(
        //   (response) => {
        //     this.notificationService.showSuccess('Delete Question successfully');
        //   }, (error) => {
        //     this.notificationService.showError(error?.error?.message || 'Something went wrong!');
        //   }
        // );
      } else {
        this.acceptTerms = false;
      }
    });
  }

  getIpAddress() {
    // this.subPoliciesService.getCurrentIp().subscribe({
    //   next: (response) => {
    //     // this.currentIp = response?.ip;
    //     console.log('Current IP:', response);
    //   },
    //   error: (err) => {
    //     console.error('Failed to get IP:', err);
    //   },
    // });
  }
}
