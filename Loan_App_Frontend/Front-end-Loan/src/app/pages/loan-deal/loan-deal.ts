
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-deal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-deal.html',
  styleUrl: './loan-deal.scss'
})
export class LoanDealComponent implements OnInit {
  private apiUrl = 'https://localhost:44365/api/LoanDeal';

  loans: any[] = [];
  loading = false;
  saving = false;

  errorMessage = '';
  message = '';

  page = 1;
  pageSize = 10;
  totalPages = 1;

  // Modal state
  showApproveModal = false;
  showRejectModal = false;
  selectedLoan: any = null;

  approvedAmount: number | null = null;
  rejectionReason = '';

  // Search and filter
  searchText = '';
  statusFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLoans();
  }

  get filteredLoans(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.loans.filter((loan: any) => {
      const dealId = String(
        loan.dealId ?? loan.DealId ?? ''
      ).toLowerCase();

      const customerId = String(
        loan.customerId ?? loan.CustomerId ?? ''
      ).toLowerCase();

      const customerName = String(
        loan.customerName ?? loan.CustomerName ?? ''
      ).toLowerCase();

      const bankName = String(
        loan.bankName ?? loan.BankName ?? ''
      ).toLowerCase();

      const loanType = String(
        loan.loanType ?? loan.LoanType ?? ''
      ).toLowerCase();

      const status = String(
        loan.currentStatus ?? loan.CurrentStatus ?? ''
      );

      const matchesSearch =
        !search ||
        dealId.includes(search) ||
        customerId.includes(search) ||
        customerName.includes(search) ||
        bankName.includes(search) ||
        loanType.includes(search);

      const matchesStatus =
        !this.statusFilter ||
        status.toLowerCase() === this.statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  loadLoans(): void {
    this.loading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('page', this.page)
      .set('pageSize', this.pageSize);

    this.http.get<any>(`${this.apiUrl}/pending`, { params }).subscribe({
      next: response => {
        const data = response?.data ?? response?.Data;

        this.loans = data?.items ?? data?.Items ?? [];
        this.totalPages = Math.max(
          1,
          data?.totalPages ?? data?.TotalPages ?? 1
        );

        this.loading = false;
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load pending loan deals.';

        this.loading = false;
      }
    });
  }

  evaluateCibil(dealId: number): void {
    this.message = '';
    this.errorMessage = '';

    this.http.post<any>(
      `${this.apiUrl}/${dealId}/evaluate-cibil`,
      {}
    ).subscribe({
      next: response => {
        this.message =
          response?.message ??
          response?.Message ??
          'CIBIL evaluation completed.';

        this.loadLoans();
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to evaluate CIBIL.';
      }
    });
  }

  // Open approval modal
  openApproveModal(loan: any): void {
    this.clearMessages();

    this.selectedLoan = loan;
    this.approvedAmount = Number(
      loan.loanAmount ?? loan.LoanAmount ?? 0
    );

    this.showApproveModal = true;
    this.showRejectModal = false;
  }

  // Open rejection modal
  openRejectModal(loan: any): void {
    this.clearMessages();

    this.selectedLoan = loan;
    this.rejectionReason = '';

    this.showRejectModal = true;
    this.showApproveModal = false;
  }

  closeModal(): void {
    if (this.saving) {
      return;
    }

    this.showApproveModal = false;
    this.showRejectModal = false;
    this.selectedLoan = null;

    this.approvedAmount = null;
    this.rejectionReason = '';
  }

  // Submit approval from modal
  submitApproval(): void {
    if (!this.selectedLoan || this.saving) {
      return;
    }

    const dealId = Number(
      this.selectedLoan.dealId ??
      this.selectedLoan.DealId
    );

    const requestedAmount = Number(
      this.selectedLoan.loanAmount ??
      this.selectedLoan.LoanAmount
    );

    const amount = Number(this.approvedAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > requestedAmount
    ) {
      this.errorMessage =
        'Approved amount must be greater than zero and cannot exceed the requested loan amount.';
      return;
    }

    this.saving = true;
    this.clearMessages();

    this.http.put<any>(
      `${this.apiUrl}/${dealId}/approve`,
      { approvedAmount: amount }
    ).subscribe({
      next: response => {
        this.message =
          response?.message ??
          response?.Message ??
          'Loan approved successfully.';

        this.showApproveModal = false;
        this.showRejectModal = false;
        this.selectedLoan = null;
        this.approvedAmount = null;

        this.saving = false;
        this.loadLoans();
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to approve loan.';

        this.saving = false;
      }
    });
  }

  // Submit rejection from modal
  submitRejection(): void {
    if (!this.selectedLoan || this.saving) {
      return;
    }

    const reason = this.rejectionReason.trim();

    if (!reason) {
      this.errorMessage = 'Please enter a rejection reason.';
      return;
    }

    const dealId = Number(
      this.selectedLoan.dealId ??
      this.selectedLoan.DealId
    );

    this.saving = true;
    this.clearMessages();

    this.http.put<any>(
      `${this.apiUrl}/${dealId}/reject`,
      { rejectionReason: reason }
    ).subscribe({
      next: response => {
        this.message =
          response?.message ??
          response?.Message ??
          'Loan rejected successfully.';

        this.showApproveModal = false;
        this.showRejectModal = false;
        this.selectedLoan = null;
        this.rejectionReason = '';

        this.saving = false;
        this.loadLoans();
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to reject loan.';

        this.saving = false;
      }
    });
  }

  statusClass(status: string): string {
    const value = (status ?? '').toLowerCase();

    if (value === 'approved') {
      return 'status-approved';
    }

    if (value === 'rejected') {
      return 'status-rejected';
    }

    if (value === 'manual review') {
      return 'status-manual';
    }

    return 'status-pending';
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadLoans();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadLoans();
    }
  }

  private clearMessages(): void {
    this.message = '';
    this.errorMessage = '';
  }
}
