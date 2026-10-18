import { Component, ChangeDetectorRef } from '@angular/core';
import { NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { LoanAccountService } from '../loan-account';


@Component({
  selector: 'app-loan-accounts',
  imports: [NgFor, CurrencyPipe, DatePipe],
  templateUrl: './loan-accounts.html',
  styleUrl: './loan-accounts.scss',
})
export class LoanAccounts {
  allLoanAccounts: any[] = [];

  constructor(
    private service: LoanAccountService,
    private cdr: ChangeDetectorRef,
  ) {
    // this.getAllLoanAccounts();
    console.log('LoanAccounts component loaded');
    this.getMyLoanAccounts();
  }

  // Get all loan accounts
  getAllLoanAccounts() {
    this.service.getAllLoanAccounts().subscribe({
      next: (res: any) => {
        console.log(res);
        this.allLoanAccounts = res;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // Get only the logged-in customer's loan accounts
  getMyLoanAccounts() {
    console.log('Calling my-accounts API');

    this.service.getMyLoanAccounts().subscribe({
      next: (res: any) => {
        console.log('API response:', res);
        this.allLoanAccounts = res;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.error('API error:', err);
      },
    });
  }

  pageSize = 5;
currentPage = 1;

get totalPages(): number {
  return Math.ceil(this.allLoanAccounts.length / this.pageSize);
}

get paginatedLoanAccounts(): any[] {
  const startIndex = (this.currentPage - 1) * this.pageSize;

  return this.allLoanAccounts.slice(
    startIndex,
    startIndex + this.pageSize
  );
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
}
