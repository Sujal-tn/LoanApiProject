import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmiShedule {
   url = 'https://localhost:44365/api/emi-schedules';

  constructor(private http: HttpClient) {}

  getEmiShedule(loanAccountId: number) {
    return this.http.get(`${this.url}/${loanAccountId}`);
  }
}