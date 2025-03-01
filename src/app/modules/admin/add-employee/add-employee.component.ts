import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  selectedFile: File | null = null;
  submitted = false;
  showLoader: boolean = false;
  employeeId!: any;
  employeeData: any;

  countries = [
    {
      name: 'India',
      states: [
        'Maharashtra',
        'Gujarat',
        'Rajasthan',
        'Karnataka',
        'Tamil Nadu',
        'Punjab',
        'Bihar',
        'West Bengal',
        'Uttar Pradesh',
        'Madhya Pradesh',
      ],
    },
    {
      name: 'USA',
      states: [
        'California',
        'Texas',
        'New York',
        'Florida',
        'Illinois',
        'Ohio',
        'Georgia',
        'Michigan',
        'Arizona',
        'Pennsylvania',
      ],
    },
    {
      name: 'Canada',
      states: [
        'Ontario',
        'British Columbia',
        'Quebec',
        'Alberta',
        'Manitoba',
        'Saskatchewan',
        'Nova Scotia',
        'New Brunswick',
        'Prince Edward Island',
        'Newfoundland',
      ],
    },
    {
      name: 'Australia',
      states: [
        'New South Wales',
        'Victoria',
        'Queensland',
        'Western Australia',
        'South Australia',
        'Tasmania',
        'Northern Territory',
        'Australian Capital Territory',
      ],
    },
    {
      name: 'UK',
      states: [
        'England',
        'Scotland',
        'Wales',
        'Northern Ireland',
        'Greater London',
        'West Midlands',
        'Yorkshire',
        'North West England',
        'East Midlands',
        'South West England',
      ],
    },
  ];

  states: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfJoining: ['', Validators.required],
      phone: ['', [Validators.required]],
      alternatePhone: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      role: ['', Validators.required],
      // profileImage: [null],
    });
  }

  get f() {
    return this.employeeForm.controls;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      console.log('Employee ID:', this.employeeId);
    });
    if (this.employeeId) {
      this.getOneEmployee();
    }
  }

  getOneEmployee() {
    this.showLoader = true;
    this.employeeService.getOneEmployee(this.employeeId).subscribe(
      (response) => {
        this.employeeData = response?.data;

        if (this.employeeData) {
          this.onCountryChange({
            target: { value: this.employeeData.country },
          });
          const formattedBirthDate = this.employeeData.birthDate
            ? new Date(this.employeeData.birthDate).toISOString().split('T')[0]
            : '';
          const formattedJoinDate = this.employeeData.dateOfJoining
            ? new Date(this.employeeData.dateOfJoining)
                .toISOString()
                .split('T')[0]
            : '';
          this.employeeForm.patchValue({
            firstName: this.employeeData.firstName,
            middleName: this.employeeData.middleName,
            lastName: this.employeeData.lastName,
            gender: this.employeeData.gender,
            birthDate: formattedBirthDate,
            email: this.employeeData.email,
            dateOfJoining: formattedJoinDate,
            phone: this.employeeData.phone,
            alternatePhone: this.employeeData.alternatePhone,
            country: this.employeeData.country,
            state: this.employeeData.state,
            city: this.employeeData.city,
            role: this.employeeData.role,
          });

          // Populate states dropdown based on selected country
        }
      },
      (error) => {
        this.showLoader = false;
        console.log('this is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    const countryData = this.countries.find((c) => c.name === selectedCountry);
    this.states = countryData ? countryData.states : [];
    this.employeeForm.patchValue({ state: '' }); // Reset state selection
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.employeeForm.patchValue({ profileImage: this.selectedFile });
    }
  }

  submitForm() {
    this.submitted = true;
    if (!this.employeeForm.valid) {
      return;
    }
    this.showLoader = true;
    let payload: any;
    if (this.employeeId) {
      payload = {
        ...this.employeeForm.value,
        password: 'Test',
        _id: this.employeeId,
      };
    } else {
      payload = { ...this.employeeForm.value, password: 'Test' };
    }
    this.employeeService.createEmployee(payload).subscribe(
      (response) => {
        this.showLoader = false;
        if (this.employeeId) {
          this.notificationService.showSuccess(
            response?.message || 'Employee Edit successfully'
          );
          this.router.navigate([
            '/admin/employee-details-outstanding',
            this.employeeId,
          ]);
        } else {
          this.notificationService.showSuccess(
            response?.message || 'Employee Create successfully'
          );
          this.router.navigate(['/admin/employee-list']);
        }
      },
      (error) => {
        this.showLoader = false;
        console.log('this is error', error);
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }
}
