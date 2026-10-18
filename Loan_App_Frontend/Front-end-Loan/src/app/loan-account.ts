import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoanAccountService {
  private apiUrl = 'https://localhost:44365/api/loan-accounts';

  constructor(private http: HttpClient) {}

  // Get all loan accounts
  getAllLoanAccounts() {
    return this.http.get(this.apiUrl);
  }

  // Get loan accounts of the logged-in customer
  getMyLoanAccounts() {
    return this.http.get(`${this.apiUrl}/my-accounts`);
  }
}
