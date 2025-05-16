import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent {
  employeeForm: FormGroup;
  selectedFile: any;
  submitted = false;
  showLoader: boolean = false;
  employeeId!: any;
  employeeData: any;
  imagePreview: string = 'assets/img/avatars/no-profile.jpg';
  isUpload: boolean = false;
  baseImageURL = environment.baseUrl;
  maxDate!: string;
  defaultDate!: string; // Date the calendar opens to
  maxJoiningDate!: string;
  countries: any = [];
  states: any[] = [];
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private employeeService: EmployeeService,
    private spinner: NgxSpinnerService,
    private http: HttpClient
  ) {
    // const today = new Date();
    const today = new Date();
    this.maxJoiningDate = today.toISOString().split('T')[0];
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // Format as yyyy-MM-dd for input[type="date"]
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];
    this.defaultDate = this.maxDate; // calendar will open at this date


    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      middleName: ['', [Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfJoining: ['', Validators.required],
      phone: ['', [Validators.required]],
      alternatePhone: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: [''],
      role: ['', Validators.required],
      jobTitle: ['', Validators.required],
      employeeIdentity: ['', Validators.required],
      jobType: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      addressLine3: [''],
      postCode: [''],
      personalEmail: [''],
      countryCode: ['', Validators.required]
      // profileImage: [null],
    });
  }

  minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  get dateOfBirth() {
    return this.employeeForm.get('dateOfBirth');
  }

  get f() {
    return this.employeeForm.controls;
  }

  ngOnInit() {
    this.getCountries();
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.getOneEmployee();
      } else {
        this.isUpload = true;
      }
    });
  }

  getCountries() {
    this.http.get<any[]>('https://countriesnow.space/api/v0.1/countries/states', { headers: { 'Content-Type': 'application/json', } }).subscribe(
      (response: any) => {
        this.countries = response?.data.map((country: any) => ({
          name: country.name,
          code: country.iso2, // Country code (e.g., US, IN),
          states: country?.states
        }));
      },
      (error) => console.error('Error fetching countries:', error)
    );
  }

  // When a country is selected, fetch states
  onCountryChange(event: any) {
    const selectedCountry = event?.target?.value;

    this.employeeForm.patchValue({ country: selectedCountry, state: '', city: '' });

    const countryData = this.countries.find((c: any) => c.name === selectedCountry);
    this.states = countryData ? countryData.states : [];
    this.employeeForm.patchValue({ state: '' }); // Reset state selection
    // this.states = []; // Reset states
    // this.cities = []; // Reset cities

    // // Fetch states based on the selected country
    // this.fetchStates();
  }

  // When a state is selected, fetch cities
  onStateChange(event: any) {
    const selectedState = event?.target?.value;
    this.employeeForm.patchValue({ state: selectedState, city: '' });
    this.cities = []; // Reset cities

    // Fetch cities based on the selected state
    this.fetchCities();
  }

  // Fetch cities dynamically
  fetchCities() {
    const url = `https://countriesnow.space/api/v0.1/countries/state/cities`;
    const payload = {
      "country": this.employeeForm.value.country,
      "state": this.employeeForm.value.state
    }
    this.http.post<any[]>(url, payload, { headers: { 'Content-Type': 'application/json', } }).subscribe(
      (data: any) => this.cities = data?.data,
      (error) => console.error('Error fetching cities:', error)
    );
  }


  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getOneEmployee() {
    this.spinner.show();
    this.employeeService.getOneEmployee(this.employeeId).subscribe(
      (response) => {
        this.employeeData = response?.data;
        if (!this.employeeData?.profileImg) {
          this.isUpload = true;
        }
        if (this.employeeData) {
          this.onCountryChange({
            target: { value: this.employeeData.country },
          });
          this.onStateChange({
            target: { value: this.employeeData.state },
          })
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
            jobTitle: this.employeeData.jobTitle,
            employeeIdentity: this.employeeData.employeeIdentity,
            jobType: this.employeeData?.jobType,
            personalEmail: this.employeeData?.personalEmail,
            addressLine1: this.employeeData?.addressLine1,
            addressLine2: this.employeeData?.addressLine2,
            addressLine3: this.employeeData?.addressLine3,
            postCode: this.employeeData?.postCode,
            countryCode: this.employeeData?.countryCode
          });
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  // onCountryChange(event: any) {
  //   const selectedCountry = event.target.value;
  //   const countryData = this.countries.find((c) => c.name === selectedCountry);
  //   this.states = countryData ? countryData.states : [];
  //   this.employeeForm.patchValue({ state: '' }); // Reset state selection
  // }

  onFileChange(event: any) {
    this.isUpload = true;
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result; // Update the image preview
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitForm() {
    this.submitted = true;
    console.log("this.employeeForm", this.employeeForm)
    if (!this.employeeForm.valid) {
      return;
    }
    if (this.employeeId) {
      return this.editEmployee();
    }
    this.spinner.show();
    const payload = { ...this.employeeForm.value };
    this.spinner.show();
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    formData.append('img', this.selectedFile);
    // payload = { ...this.employeeForm.value, password: 'Test' };

    // API call to create employee(s)
    this.employeeService.createEmployee(formData).subscribe(
      (response) => {
        this.spinner.hide();
        if (this.employeeId) {
          this.notificationService.showSuccess(
            response?.message || 'Employee updated successfully'
          );
          this.router.navigate(['/admin/employee-details-outstanding', this.employeeId]);
        } else {
          this.notificationService.showSuccess(
            response?.message || 'Employee(s) created successfully'
          );
          this.router.navigate(['/admin/employee-list']);
        }
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.error?.message || 'Something went wrong!'
        );
      }
    );
  }

  editEmployee() {
    if (!this.employeeForm.valid) {
      return;
    }

    const payload = { ...this.employeeForm.value, password: 'Test', id: this.employeeId };
    this.spinner.show();
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    formData.append('img', this.selectedFile);

    this.employeeService.updateEmp(formData).subscribe(
      (response) => {
        this.spinner.hide();
        this.notificationService.showSuccess(response?.message || 'Employee updated successfully');
        this.router.navigate(['/admin/employee-details-outstanding', this.employeeId]);
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
      }
    );
  }
}
