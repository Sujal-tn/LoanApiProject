import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScoreCardService {
  http=inject(HttpClient);

  private readonly url = 'https://localhost:44365/api/ScoreCard';

  generateScoreCard(customerId: number) {
    return this.http.post<any>(`${this.url}/generate/${customerId}`, {});
  }

  getScoreCard() {
    return this.http.get<any>(`${this.url}/get`);
  }
}