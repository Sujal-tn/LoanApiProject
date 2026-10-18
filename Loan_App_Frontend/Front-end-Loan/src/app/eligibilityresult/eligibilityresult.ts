import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EligibilityService } from '../eligibility-service';

@Component({
  selector: 'app-eligibility-result',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './eligibilityresult.html',
  styleUrl: './eligibilityresult.scss',
})
export class EligibilityResult {
  constructor(private service: EligibilityService) {}

  tenures=[36,60,72,120];
  tenureMonths:number=36;

  customer=signal<any>(null);
  result=signal<any>(null);
  errorMessage=signal('');

  private normalizeCustomer(response: any) {
    const data = response?.data ?? response;
    const customer = data?.customer ?? data;
    const customerName = customer?.customerName ??
      [customer?.firstName, customer?.lastName].filter(Boolean).join(' ');
    const panNo = customer?.panNo ?? customer?.panNumber ?? customer?.pan ??
      customer?.PanNumber ?? data?.panNo ?? data?.panNumber ?? data?.pan ?? data?.PanNumber;

    return {
      ...customer,
      customerName,
      panNo,
      monthlyIncome: customer?.monthlyIncome,
    };
  }

  checkEligibility()
  {
    this.errorMessage.set('');
    this.customer.set(null);
    this.result.set(null);
    this.getResult();
  }

  getResult()
  {
    this.service.checkEligibility(this.tenureMonths).subscribe({
      next:res=>{
        console.log(res);
        const result = res?.data ?? res;
        this.result.set(result);
        this.customer.set(this.normalizeCustomer(result));
      },
      error:err=>{
        console.log(err);
        this.showError(err);
      }
    });
  }

  showError(err:any)
  {
    if(err.status==404 && typeof err.error=='string')
    {
      this.errorMessage.set(err.error);
    }
    else
    {
      this.errorMessage.set('Something went wrong. Is the API running?');
    }
  }
}