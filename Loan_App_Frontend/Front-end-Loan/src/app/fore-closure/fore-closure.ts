import { Component } from '@angular/core';
import {  ForeclosureService } from '../foreclosureservice';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-fore-closure',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './fore-closure.html',
  styleUrl: './fore-closure.scss',
})
export class ForeClosure {

  constructor(private service:ForeclosureService){
     this.getLoanAccounts();
     this.myreq();
  }
  
  loanaccounts:any;
  selectedLoan:any;
  getLoanAccounts()
  {
    this.service.getloanaccounts().subscribe({
       next:res=>{
        console.log(res.data)
        this.loanaccounts=res;
       if (this.loanaccounts.length > 0) {
          this.selectedLoan = this.loanaccounts[0];
        }
        this.foreclosureform.patchValue({ 
          loanAccountId: this.selectedLoan.loanAccountId,
          foreClosureAmount: this.selectedLoan.outstandingPrincipal
        });
       },
       error:err=>{
         console.log(err)
       }
    })
  }

onChangeLoan(event: any) {
  let id = Number(event.target.value);

  this.selectedLoan = this.loanaccounts.find(
    (loan: any) => loan.loanAccountId === id
  );

  this.foreclosureform.patchValue({
    loanAccountId: id,
    foreClosureAmount: this.selectedLoan.outstandingPrincipal
  });
}

foreclosureform=new FormGroup({
  requestId: new FormControl<number>(0),
  loanAccountId: new FormControl<number>(0),
  foreClosureType: new FormControl<string>('Full'),
  foreClosureAmount: new FormControl<number>(0),
  partialAmount: new FormControl<number>(0),
  requestedDate: new FormControl<string>(new Date().toISOString()),
  expectedClosureDate: new FormControl<string>(''),
  reason: new FormControl<string>(''),
  approvedDate: new FormControl<string | null>(null),
  isPaid: new FormControl<boolean>(false),
  paidDate: new FormControl<string | null>(null)
});

submitrequest(data:any)
{
   console.log('Form data:', data);
  console.log('Request JSON:', JSON.stringify(data));
  this.service.createforeclosure(data).subscribe({
    
    next:res=>{
       alert(res.message);
    },
    error:err=>{
    console.log('Validation errors:', err.error.errors);
  console.log('Full error:', err.error);
    }
  });
}

myreq()
{
  this.service.myrequest().subscribe({
    next: res=>{
       console.log(res.data);
    },
    error:err=>{
       console.log(err);
    }
  })
}

}
