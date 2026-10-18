
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface KycDocument {
  documentId: number;
  customerId: number;
  documentType: string;
  verificationStatus: string;
  rejectionReason?: string | null;
  uploadedAt: string;
  reviewedAt?: string | null;
}

export interface KycResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class KycService {
  private http = inject(HttpClient);

  private url = 'https://localhost:44365/api/Kyc/Upload';
  private url2 = 'https://localhost:44365/api/Kyc/MyDocuments';
  private url3 = 'https://localhost:44365/api/Kyc/PendingDocuments';
  private url4 = 'https://localhost:44365/api/Kyc/Approve';
  private url5 = 'https://localhost:44365/api/Kyc/Reject';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  UploadDocument(
    documentType: string,
    file: File
  ): Observable<KycResponse> {
    const formData = new FormData();

    formData.append('documentType', documentType);
    formData.append('file', file);

    return this.http.post<KycResponse>(
      this.url,
      formData,
      { headers: this.getHeaders() }
    );
  }

  GetMyDocuments(): Observable<KycDocument[]> {
    return this.http.get<KycDocument[]>(
      this.url2,
      { headers: this.getHeaders() }
    );
  }

  GetPendingDocuments(): Observable<KycDocument[]> {
    return this.http.get<KycDocument[]>(
      this.url3,
      { headers: this.getHeaders() }
    );
  }

  ApproveDocument(documentId: number): Observable<KycResponse> {
    return this.http.put<KycResponse>(
      `${this.url4}/${documentId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  RejectDocument(
    documentId: number,
    reason: string
  ): Observable<KycResponse> {
    return this.http.put<KycResponse>(
      `${this.url5}/${documentId}`,
      { reason },
      { headers: this.getHeaders() }
    );
  }
}
