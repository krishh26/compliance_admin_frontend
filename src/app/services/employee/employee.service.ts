import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

export enum EmployeeEndPoint {
  EMPLOYEE = '/employee',
  UPDATE_EMPLOYEE = '/employee/update',
  COMPLETED_TEST_LIST = '/result/list',
  OUTSTANDING_TEST_LIST = '/result/out-stading-list',
  CREATE_PASSWORD = 'auth/create-password'
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  baseUrl!: string;
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getHeader(): HttpHeaders {
    let token = this.localStorageService.getLoggerToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Add token if it exists
    });
    return headers;
  }

  getEmployee(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + EmployeeEndPoint.EMPLOYEE, {
      headers: this.getHeader(),
    });
  }

  getCompletedTestList(param: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + EmployeeEndPoint.COMPLETED_TEST_LIST, param, {
      headers: this.getHeader(),
    });
  }

  getOutstandingTestList(param: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + EmployeeEndPoint.OUTSTANDING_TEST_LIST, param, {
      headers: this.getHeader(),
    });
  }

  getOneEmployee(id: string): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + EmployeeEndPoint.EMPLOYEE + '/' + id,
      {
        headers: this.getHeader(),
      }
    );
  }

  createEmployee(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + EmployeeEndPoint.EMPLOYEE,
      payload,
      { headers: this.getHeader() }
    );
  }

  updateEmp(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + EmployeeEndPoint.UPDATE_EMPLOYEE,
      payload,
      { headers: this.getHeader() }
    );
  }

  createPassowrd(payload: any, token: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseUrl}${EmployeeEndPoint.CREATE_PASSWORD}?token=${token}`,
      payload,
      { headers: this.getHeader() }
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + EmployeeEndPoint.EMPLOYEE + '/' + id,
      {
        headers: this.getHeader(),
      }
    );
  }
}
