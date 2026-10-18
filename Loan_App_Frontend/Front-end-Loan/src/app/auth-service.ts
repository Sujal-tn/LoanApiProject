
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  role?: string;
  requires2FASetup?: boolean;
  challengeId?: string;
  qrCode?: string;
}

export interface RegisterRequest {
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  email: string | null;
  password: string | null;
  mobileNo: string | null;
  pan: string | null;
  aadhaarNo: string | null;
  employmentType: string | null;
  monthlyIncome: number | null;
  totalMonthlyDebt: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private url = 'https://localhost:44365/api/Auth/Register';
  private url2 = 'https://localhost:44365/api/Auth/VerifyRegistrationOtp';
  private url3 = 'https://localhost:44365/api/Auth/Login';
  private url4 = 'https://localhost:44365/api/Auth/Setup2FA';
  private url5 = 'https://localhost:44365/api/Auth/VerifyOTP';
  private url6 = 'https://localhost:44365/api/Auth/GoogleLogin';

  Register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url, data);
  }

  VerifyRegistrationOtp(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url2, data);
  }

  Login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url3, data);
  }

  Setup2FA(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url4, data);
  }

  VerifyOTP(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.url5, data);
  }
logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

GoogleLogin(data: any): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(this.url6, data);
}

}
