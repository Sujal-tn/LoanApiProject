
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api-config';

export interface ApprovedLoan {
  dealId: number;
  customerId: number;
  loanType: string;
  loanAmount: number;
  approvedAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  appliedDate: string;
}

export interface SanctionLetter {
  sanctionLetterId: number;
  dealId: number;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  createdAt: string;
  fileName: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SanctionService {

  http = inject(HttpClient);

  url = API_BASE_URL + '/SanctionLetter';

  getApprovedLoans(page: number, pageSize: number) {
    return this.http.get<any>(
      this.url + '/approved-loans?page=' + page + '&pageSize=' + pageSize
    );
  }

  generate(dealId: number) {
    return this.http.post<any>(
      this.url + '/' + dealId + '/generate',
      {}
    );
  }

  download(dealId: number) {
    return this.http.get(
      this.url + '/' + dealId + '/download',
      { responseType: 'blob' }
    );
  }
}
