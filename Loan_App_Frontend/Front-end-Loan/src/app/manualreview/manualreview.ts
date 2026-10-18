import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EligibilityService } from '../eligibility-service';

@Component({
  selector: 'app-manual-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './manualreview.html',
  styleUrl: './manualreview.scss',
})
export class ManualReview {
  constructor(private service:EligibilityService) {
    this.getManualReviews();
  }

  reviews=signal<any[]>([]);       // customers waiting for manual review
  selected=signal<any>(null);      // customer shown in the details table
  loaded=signal(false);
  successMessage=signal('');
  errorMessage=signal('');

  selectedId:number=0;
  rejectionReason:string='';
  otherReason:string='';

  // fill the dropdown
  getManualReviews()
  {
    this.service.getManualReviews().subscribe({
      next:res=>{
        console.log(res);
        this.reviews.set(res.data);
        this.loaded.set(true);
      },
      error:err=>{
        console.log(err);
        this.showError(err);
      }
    });
  }

  // Check Eligibility button: show details of the selected customer
  checkEligibility()
  {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.rejectionReason='';
    this.otherReason='';

    if(this.selectedId==0)
    {
      this.selected.set(null);
      this.errorMessage.set('Please select a customer');
      return;
    }

    let customer=this.reviews().find(r=>r.customerId==this.selectedId);
    this.selected.set(customer);
  }

  // Approve button
  approve()
  {
    this.sendDecision('Approved','');
  }

  // Reject button
  reject()
  {
    let reason=this.rejectionReason;

    if(reason=='')
    {
      this.errorMessage.set('Please select a rejection reason');
      return;
    }

    if(reason=='Other')
    {
      reason=this.otherReason.trim();
      if(reason=='')
      {
        this.errorMessage.set('Please enter the other reason');
        return;
      }
    }

    this.sendDecision('Rejected',reason);
  }

  sendDecision(decision:string,reason:string)
  {
    this.successMessage.set('');
    this.errorMessage.set('');

    let body={
      customerId:this.selected().customerId,
      decision:decision,
      rejectionReason:reason
    };

    this.service.decideManualReview(body).subscribe({
      next:res=>{
        console.log(res);
        this.successMessage.set(res.message);

        // clear the screen and reload the dropdown
        this.selected.set(null);
        this.selectedId=0;
        this.rejectionReason='';
        this.otherReason='';
        this.getManualReviews();
      },
      error:err=>{
        console.log(err);
        this.showError(err);
      }
    });
  }

  showError(err:any)
  {
    if(err.status==401)
    {
      this.errorMessage.set('You are not logged in, or your login has expired.');
    }
    else if(err.status==403)
    {
      this.errorMessage.set('Only a Loan Officer can use this page.');
    }
    else if((err.status==400 || err.status==404) && typeof err.error=='string')
    {
      // the API sends plain text for 400 and 404
      this.errorMessage.set(err.error);
    }
    else
    {
      this.errorMessage.set('Something went wrong. Is the API running?');
    }
  }
}