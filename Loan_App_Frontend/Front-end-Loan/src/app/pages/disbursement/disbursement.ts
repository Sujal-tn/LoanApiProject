
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disbursement.html',
  styleUrl: './disbursement.scss'
})
export class DisbursementComponent implements OnInit {
  private apiUrl = 'https://localhost:44365/api/Disbursement';

  loans: any[] = [];
  loading = false;
  saving = false;

  errorMessage = '';
  message = '';

  page = 1;
  pageSize = 10;
  totalPages = 1;

  searchText = '';

  bankPartners: string[] = [
    'SBI',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Other'
  ];

  selectedBanks: Record<number, string> = {};
  selectedLoan: any = null;
  selectedBank = 'SBI';
  disburseAmount: number | null = null;
  showDisburseModal = false;

  get filteredLoans(): any[] {
    const search = this.searchText.trim().toLowerCase();

    return this.loans.filter((loan: any) => {
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPendingDisbursements();
  }

  loadPendingDisbursements(): void {
    this.loading = true;
    this.errorMessage = '';

    const params = new HttpParams()
      .set('page', this.page)
      .set('pageSize', this.pageSize);

    this.http.get<any>(
      `${this.apiUrl}/pending`, { params }
    ).subscribe({
      next: response => {
        const data = response?.data ?? response?.Data;

        this.loans = data?.items ?? data?.Items ?? [];
        this.totalPages = Math.max(
          1,
          data?.totalPages ?? data?.TotalPages ?? 1
        );

        for (const loan of this.loans) {
          const id = Number(loan.dealId ?? loan.DealId);

          if (!this.selectedBanks[id]) {
            this.selectedBanks[id] = this.bankPartners[0];
          }
        }

        this.loading = false;
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to load pending disbursements.';

        this.loading = false;
      }
    });
  }

  openDisburseModal(loan: any): void {
    this.message = '';
    this.errorMessage = '';

    this.selectedLoan = loan;

    const id = Number(loan.dealId ?? loan.DealId);

    this.selectedBank = this.selectedBanks[id] ?? this.bankPartners[0];

    this.disburseAmount = Number(
      loan.disburseAmount ??
      loan.DisburseAmount ??
      loan.approvedAmount ??
      loan.ApprovedAmount ??
      0
    );

    this.showDisburseModal = true;
  }

  closeDisburseModal(): void {
    if (this.saving) {
      return;
    }

    this.showDisburseModal = false;
    this.selectedLoan = null;
    this.disburseAmount = null;
  }

  confirmDisbursement(): void {
    if (!this.selectedLoan || this.saving) {
      return;
    }

    const dealId = Number(
      this.selectedLoan.dealId ??
      this.selectedLoan.DealId
    );

    const amount = Number(this.disburseAmount);

    const approvedAmount = Number(
      this.selectedLoan.approvedAmount ??
      this.selectedLoan.ApprovedAmount ??
      this.selectedLoan.disburseAmount ??
      this.selectedLoan.DisburseAmount ??
      0
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > approvedAmount
    ) {
      this.errorMessage =
        'Enter a valid disbursement amount that does not exceed the approved amount.';
      return;
    }

    if (!this.selectedBank) {
      this.errorMessage = 'Please select a bank partner.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.message = '';

    this.http.post<any>(`${this.apiUrl}/disburse`, {
      dealId,
      disburseAmount: amount,
      bankPartner: this.selectedBank
    }).subscribe({
      next: response => {
        this.message =
          response?.message ??
          response?.Message ??
          'Loan disbursed successfully.';

        this.selectedBanks[dealId] = this.selectedBank;
        this.showDisburseModal = false;
        this.selectedLoan = null;
        this.disburseAmount = null;
        this.saving = false;

        this.loadPendingDisbursements();
      },
      error: error => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to disburse loan.';

        this.saving = false;
      }
    });
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadPendingDisbursements();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPendingDisbursements();
    }
  }
}
