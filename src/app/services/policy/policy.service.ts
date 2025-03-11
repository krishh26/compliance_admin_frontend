import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

export enum PolicyEndPoint {
  POLICY = '/policy',
  POLICY_LIST = '/policy/list',
}

@Injectable({
  providedIn: 'root',
})
export class PolicyService {
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

  getPolicyList(): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + PolicyEndPoint.POLICY_LIST,
      {},
      {
        headers: this.getHeader(),
      }
    );
  }

  getPolicyDetails(id: string): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + PolicyEndPoint.POLICY + '/' + id,
      { headers: this.getHeader() }
    );
  }

  createPolicy(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + PolicyEndPoint.POLICY,
      payload,
      { headers: this.getHeader() }
    );
  }

  deletePolicy(id: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + PolicyEndPoint.POLICY + '/' + id,
      {
        headers: this.getHeader(),
      }
    );
  }
}
