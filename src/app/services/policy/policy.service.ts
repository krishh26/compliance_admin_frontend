import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum PolicyEndPoint {
  POLICY = '/policy',
}

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  baseUrl!: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Ensure the token is stored as a string
  }


  getHeader(): HttpHeaders {
    let token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Add token if it exists
    });
    return headers;
  }

  getPolicyList(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + PolicyEndPoint.POLICY, {
      headers: this.getHeader(),
    });
  }

  getPolicyDetails(id: string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + PolicyEndPoint.POLICY + '/' + id, { headers: this.getHeader() });
  }

  createPolicy(payload: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + PolicyEndPoint.POLICY, payload, { headers: this.getHeader() });
  }
}
