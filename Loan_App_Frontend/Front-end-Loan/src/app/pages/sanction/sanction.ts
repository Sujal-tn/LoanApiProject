
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-sanction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sanction.html',
  styleUrl: './sanction.scss'
})
export class SanctionComponent implements OnInit {
  private apiUrl = 'https://localhost:44365/api/SanctionLetter';

  loans: any[] = [];
  loading = false;
  saving = false;

  errorMessage = '';
  message = '';

  searchText = '';
  showGenerateModal = false;
  selectedLoan: any = null;

  page = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadApprovedLoans();
  }

  // Search approved loans
  get filteredLoans(): any[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.loans;
    }

    return this.loans.filter(loan => {
      const values = [
        loan.dealId ?? loan.DealId,
        loan.customerId ?? loan.CustomerId,
        loan.customerName ?? loan.CustomerName,
        loan.bankName ?? loan.BankName
      ];

      return values.some(value =>
        String(value ?? '').toLowerCase().includes(search)
      );
    });
  }

  // Load approved loans
  loadApprovedLoans(): void {
    this.loading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('page', this.page)
      .set('pageSize', this.pageSize);

    this.http.get<any>(
      `${this.apiUrl}/approved-loans`,
      { params }
    ).subscribe({
      next: response => {
        const data = response?.data ?? response?.Data ?? response;

        this.loans =
          data?.items ??
          data?.Items ??
          data?.data?.items ??
          data?.Data?.Items ??
          [];

        this.totalPages =
          data?.totalPages ??
          data?.TotalPages ??
          1;

        this.loading = false;
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load approved loans.';

        this.loading = false;
      }
    });
  }

  // Open Generate Sanction Letter modal
  openGenerateModal(loan: any): void {
    this.selectedLoan = loan;
    this.showGenerateModal = true;
    this.errorMessage = '';
    this.message = '';
  }

  // Close modal
  closeGenerateModal(): void {
    if (this.saving) {
      return;
    }

    this.showGenerateModal = false;
    this.selectedLoan = null;
  }

  // Generate sanction letter
  generateLetter(): void {
    if (!this.selectedLoan || this.saving) {
      return;
    }

    const dealId =
      this.selectedLoan.dealId ??
      this.selectedLoan.DealId;

    if (!dealId) {
      this.errorMessage = 'Deal ID is missing.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.message = '';

    this.http.post<any>(
      `${this.apiUrl}/${dealId}/generate`,
      {}
    ).subscribe({
      next: response => {
        this.message =
          response?.message ??
          response?.Message ??
          'Sanction letter generated successfully.';

        this.saving = false;
        this.showGenerateModal = false;
        this.selectedLoan = null;

        this.loadApprovedLoans();
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to generate sanction letter.';

        this.saving = false;
      }
    });
  }

  // Download sanction letter PDF
  downloadLetter(loan: any): void {
    const dealId = loan.dealId ?? loan.DealId;

    this.errorMessage = '';

    this.http.get(
      `${this.apiUrl}/${dealId}/download`,
      { responseType: 'blob' }
    ).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `SanctionLetter_${dealId}.pdf`;
        link.click();

        URL.revokeObjectURL(url);
      },
      error: () => {
        this.errorMessage =
          'Unable to download the sanction letter. Generate it first.';
      }
    });
  }

  // Previous page
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadApprovedLoans();
    }
  }

  // Next page
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadApprovedLoans();
    }
  }
}
