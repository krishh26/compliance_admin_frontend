import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum AuthEndPoint {
  LOGIN_USER = '/auth/login',
  FORGOT_PASSWORD = '/auth/forgot-password',
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  baseUrl!: string;
  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  getHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headers;
  }

  loginUser(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + AuthEndPoint.LOGIN_USER,
      payload,
      { headers: this.getHeader() }
    );
  }

  forgotUser(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + AuthEndPoint.FORGOT_PASSWORD,
      payload,
      { headers: this.getHeader() }
    );
  }
}
