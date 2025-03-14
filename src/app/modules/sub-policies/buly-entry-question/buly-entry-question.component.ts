import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SubPoliciesService } from 'src/app/services/sub-policy/sub-policies.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-buly-entry-question',
  templateUrl: './buly-entry-question.component.html',
  styleUrls: ['./buly-entry-question.component.css']
})
export class BulyEntryQuestionComponent {

  showLoader: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private notificationService: NotificationService,
    private router: Router,
   private subPoliciesService: SubPoliciesService,
    private activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService
  ) { }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* Read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* Get first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* Convert sheet to JSON */
      let data = <any[][]>XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Remove header row
      const headers = data[0];
      data = data.slice(1);

      // Function to replace null or undefined values with empty strings
      const replaceNullWithEmptyString = (value: any) => value == null ? "" : value;

      // Map data to API structure
      const questions = data.map(row => {
        // Extract question type and text
        const questionType = replaceNullWithEmptyString(row[0]); // Column A (questionType)
        const questionText = replaceNullWithEmptyString(row[1]); // Column B (questionText)

        // Extract options dynamically (from C to F)
        const options = [];
        for (let i = 2; i <= 5; i++) { // Columns C to F (option1 to option4)
          if (row[i]) {
            options.push({ index: i - 2, value: row[i].toString().trim() });
          }
        }

        // Extract answer from column G (index 6)
        const answer = replaceNullWithEmptyString(row[6]);

        return {
          questionType,
          questionText,
          options,
          isActive: "1", // Default to active
          answer,
        };
      });

      // Prepare payload
      const payload = {
        questions,
        subPolicyId: "67d1f9f0b4eef0ee913a46d6",
        userGroup: "1"
      };

      console.log(payload); // Check the formatted payload before sending

      this.spinner.show();
      this.subPoliciesService.createQuestion(payload).subscribe(
        (res) => {
          this.spinner.hide();
          if (res?.statusCode == 201) {
            this.notificationService.showSuccess(res?.message);
            window.location.reload();
            this.router.navigate(['/sub-policies/question-list']);
          } else {
            this.notificationService.showError(res?.message);
          }
        },
        (error) => {
          this.spinner.hide();
          this.notificationService.showError(error?.error?.message);
        }
      );
    };

    reader.readAsBinaryString(target.files[0]);
  }


  close() {
    this.activeModal.close();
  }

}

