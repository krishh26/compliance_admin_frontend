import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

export enum EmployeeEndPoint {
  EMPLOYEE = '/employee',
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

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + EmployeeEndPoint.EMPLOYEE + '/' + id,
      {
        headers: this.getHeader(),
      }
    );
  }
}
