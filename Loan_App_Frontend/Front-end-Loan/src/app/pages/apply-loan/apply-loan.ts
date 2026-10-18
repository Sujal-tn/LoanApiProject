
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-loan.html',
  styleUrl: './apply-loan.scss'
})
export class ApplyLoanComponent implements OnInit {

  private apiUrl = 'https://localhost:44365/api/ApplyLoan';

  loanTypes: string[] = [
    'Home Loan',
    'Personal Loan',
    'Educational Loan'
  ];

  tenures: any[] = [
    { months: 36, years: 3, interestRate: 11.5 },
    { months: 60, years: 5, interestRate: 11.0 },
    { months: 72, years: 6, interestRate: 11.0 },
    { months: 120, years: 10, interestRate: 11.0 }
  ];

  emiDates: number[] = [5, 7, 10, 15];

  loan = {
    loanType: '',
    loanAmount: 0,
    tenureMonths: 36,
    interestRate: 11.5,
    emiAmount: 0,
    bankName: '',
    bankAccountNumber: '',
    ifscCode: '',
    emiDay: 7
  };

  loading = false;
  message = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLoanOptions();
  }

  loadLoanOptions(): void {
    this.http.get<any>(`${this.apiUrl}/options`).subscribe({
      next: (response) => {
        const data = response?.data ?? response?.Data ?? response;

        if (data?.loanTypes) {
          this.loanTypes = data.loanTypes;
        }

        if (data?.tenures) {
          this.tenures = data.tenures.map((t: any) => ({
            months: t.months ?? t.Months,
            years: t.years ?? t.Years,
            interestRate: t.interestRate ?? t.InterestRate
          }));
        }

        if (data?.emiDates) {
          this.emiDates = data.emiDates;
        }

        this.updateInterestRate();
      },
      error: () => {
        this.errorMessage = 'Unable to load loan options.';
      }
    });
  }

  updateInterestRate(): void {
    const selected = this.tenures.find(
      t => Number(t.months) === Number(this.loan.tenureMonths)
    );

    if (selected) {
      this.loan.interestRate = Number(selected.interestRate);
    }

    this.loan.emiAmount = 0;
    this.message = '';
    this.errorMessage = '';
  }

  calculateEmi(): void {
    this.message = '';
    this.errorMessage = '';

    if (this.loan.loanAmount <= 0) {
      this.errorMessage = 'Loan amount must be greater than zero.';
      return;
    }

    const selected = this.tenures.find(
      t => Number(t.months) === Number(this.loan.tenureMonths)
    );

    if (!selected) {
      this.errorMessage = 'Please select a valid loan tenure.';
      return;
    }

    // The API expects tenureYears, not tenureMonths.
    const params = new HttpParams()
      .set('loanAmount', this.loan.loanAmount.toString())
      .set('tenureYears', selected.years.toString());

    // CustomerId comes from the JWT on the backend.
    this.http.get<any>(`${this.apiUrl}/calculate`, { params }).subscribe({
      next: (response) => {
        const result = response?.data ?? response?.Data ?? response;
        this.loan.emiAmount =
          result?.emiAmount ?? result?.EmiAmount ?? 0;

        this.loan.interestRate =
          result?.interestRate ?? result?.InterestRate ??
          this.loan.interestRate;

        this.message = 'EMI calculated successfully.';
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Unable to calculate EMI. Please check your loan details and login.';
      }
    });
  }

  submitApplication(): void {
    this.message = '';
    this.errorMessage = '';

    if (!this.loan.loanType) {
      this.errorMessage = 'Please select a loan type.';
      return;
    }

    if (this.loan.loanAmount <= 0) {
      this.errorMessage = 'Loan amount must be greater than zero.';
      return;
    }

    if (
      !this.loan.bankName.trim() ||
      !this.loan.bankAccountNumber.trim() ||
      !this.loan.ifscCode.trim()
    ) {
      this.errorMessage = 'Please enter all bank details.';
      return;
    }

    if (!this.emiDates.includes(Number(this.loan.emiDay))) {
      this.errorMessage = 'Please select a valid EMI payment date.';
      return;
    }

    const selected = this.tenures.find(
      t => Number(t.months) === Number(this.loan.tenureMonths)
    );

    if (!selected) {
      this.errorMessage = 'Please select a valid loan tenure.';
      return;
    }

    // Do not send CustomerId. The backend gets it from the JWT.
    const request = {
      loanType: this.loan.loanType,
      loanAmount: Number(this.loan.loanAmount),
      tenureMonths: Number(this.loan.tenureMonths),
      interestRate: Number(this.loan.interestRate),
      emiAmount: Number(this.loan.emiAmount),
      bankName: this.loan.bankName.trim(),
      bankAccountNumber: this.loan.bankAccountNumber.trim(),
      ifscCode: this.loan.ifscCode.trim(),
      emiDay: Number(this.loan.emiDay)
    };

    this.loading = true;

    this.http.post<any>(`${this.apiUrl}/apply`, request).subscribe({
      next: (response) => {
        this.loading = false;
        this.message =
          response?.message ??
          response?.Message ??
          'Loan application submitted successfully.';
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ??
          error?.error?.Message ??
          'Loan application failed. Please try again.';
      }
    });
  }
}
