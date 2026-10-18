import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class CibilService {
  http=inject(HttpClient);

  private readonly url = 'https://localhost:44365/api/Cibil';

  calculateCibil() {
    return this.http.post<any>(`${this.url}/calculate`, {});
  }

  getLatestCibil() {
    return this.http.get<any>(`${this.url}/latest`);
  }
}
