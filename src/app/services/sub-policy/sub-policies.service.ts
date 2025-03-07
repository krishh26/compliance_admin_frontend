import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';

export enum SubPolicyEndPoint {
  SUB_POLICY = '/sub-policy',
  SUB_POLICY_LIST = '/sub-policy/list',
  SUB_POLICY_DELETE = '/sub-policy/delete',
}

@Injectable({
  providedIn: 'root',
})
export class SubPoliciesService {
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

  getSubPolicyList(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SubPolicyEndPoint.SUB_POLICY_LIST,
      payload,
      {
        headers: this.getHeader(),
      }
    );
  }

  getPolicyDetails(id: string): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SubPolicyEndPoint.SUB_POLICY + '/' + id,
      { headers: this.getHeader() }
    );
  }

  createPolicy(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SubPolicyEndPoint.SUB_POLICY,
      payload,
      { headers: this.getHeader() }
    );
  }

  deleteSubPolicy(id: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SubPolicyEndPoint.SUB_POLICY_DELETE,
      id,
      {
        headers: this.getHeader(),
      }
    );
  }
}
