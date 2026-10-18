
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoandealService {

  http = inject(HttpClient);

  url = "http://localhost:5087/api/LoanDeal";

  getPending(page: number, pageSize: number) {
    return this.http.get<any>(
      this.url + "/pending?page=" + page + "&pageSize=" + pageSize
    );
  }

  getById(dealId: number) {
    return this.http.get<any>(
      this.url + "/" + dealId
    );
  }

  evaluateCibil(dealId: number) {
    return this.http.post<any>(
      this.url + "/" + dealId + "/evaluate-cibil", {}
    );
  }

  approve(dealId: number, approvedAmount: number) {
    return this.http.put<any>(
      this.url + "/" + dealId + "/approve",
      { approvedAmount: approvedAmount }
    );
  }

  reject(dealId: number, rejectionReason: string) {
    return this.http.put<any>(
      this.url + "/" + dealId + "/reject",
      { rejectionReason: rejectionReason }
    );
  }
}
