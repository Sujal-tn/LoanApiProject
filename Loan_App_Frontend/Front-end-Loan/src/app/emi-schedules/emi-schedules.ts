import { Component, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanAccountService } from './../loan-account';
import { EmiShedule } from './../emi-shedule';
import { filter } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-emi-schedules',
  imports: [NgFor, NgIf, DatePipe, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './emi-schedules.html',
  styleUrl: './emi-schedules.scss',
})
export class EmiSchedules {
  allLoanAccounts: any[] = [];
  selectedLoanAccountId: any = '';
  allEmis: any[] = [];

  constructor(
    private loanService: LoanAccountService,
    private emiService: EmiShedule,
    private cdr: ChangeDetectorRef,
  ) {
    this.getAllLoanAccounts();
  }

  getAllLoanAccounts() {
    this.loanService.getAllLoanAccounts().subscribe({
      next: (res: any) => {
        this.allLoanAccounts = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getEmiSchedule() {
    if (this.selectedLoanAccountId === '') {
      this.allEmis = [];
      return;
    }

    this.emiService.getEmiShedule(this.selectedLoanAccountId).subscribe({
      next: (res: any) => {
        console.log('EMI response:', res);
        this.allEmis = res;
        this.calculateSummary();
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        console.log('EMI error:', err);
      },
    });
  }

  paidCount = 0;
  paidAmount = 0;

  pendingCount = 0;
  pendingAmount = 0;

  remainingBalance = 0;

  calculateSummary() {
    this.paidCount = this.allEmis.filter(
      (emi) => emi.paymentStatus?.toLowerCase() === 'paid',
    ).length;

    this.paidAmount = this.allEmis
      .filter((emi) => emi.paymentStatus?.toLowerCase() === 'paid')
      .reduce((total, emi) => total + Number(emi.emi || 0), 0);

    this.pendingCount = this.allEmis.filter(
      (emi) => emi.paymentStatus?.toLowerCase() !== 'paid',
    ).length;

    this.pendingAmount = this.allEmis
      .filter((emi) => emi.paymentStatus?.toLowerCase() !== 'paid')
      .reduce((total, emi) => total + Number(emi.emi || 0), 0);

    this.remainingBalance = this.allEmis
      .filter((emi) => emi.paymentStatus?.toLowerCase() !== 'paid')
      .reduce((total, emi) => total + Number(emi.closingBalance || 0), 0);
  }
}
