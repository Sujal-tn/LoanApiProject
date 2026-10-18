
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api-config';

export interface Disbursement {
  dealId: number;
  disburseAmount: number;
  bankPartner: string;
  disbursementDate?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {

  http = inject(HttpClient);

  url = API_BASE_URL + '/Disbursement';

  getPending(page: number, pageSize: number) {
    return this.http.get<any>(
      this.url + '/pending?page=' + page + '&pageSize=' + pageSize
    );
  }

  getAll(page: number, pageSize: number) {
    return this.http.get<any>(
      this.url + '?page=' + page + '&pageSize=' + pageSize
    );
  }

  disburse(value: Disbursement) {
    return this.http.post<any>(
      this.url + '/disburse',
      value
    );
  }
}
