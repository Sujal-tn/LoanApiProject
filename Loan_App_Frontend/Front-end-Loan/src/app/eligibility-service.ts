import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EligibilityService {
  http=inject(HttpClient);

  private readonly url = 'https://localhost:44365/api/Eligibility';

  checkEligibility(tenureMonths: number) {
    return this.http.post<any>(`${this.url}/check/${tenureMonths}`, {});
  }

  getManualReviews() {
    return this.http.get<any>(`${this.url}/manual-reviews`);
  }

  decideManualReview(decision: any) {
    return this.http.post<any>(`${this.url}/manual-review/decision`, decision);
  }
}