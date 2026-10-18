import { Component } from '@angular/core';
import { Emiservice } from '../emiservice';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


declare var Razorpay: any;
@Component({
  selector: 'app-emi-payment',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './emi-payment.html',
  styleUrl: './emi-payment.scss',
})
export class EmiPayment {

  constructor(private service:Emiservice, private route: ActivatedRoute)
  {
    this.route.queryParams.subscribe(params => { const eid = Number(params['id']);
      if (eid) {
        this.getemid(eid);
      }
    });
  }

emiDetails: any;
 
getemid(eid: number) {
  this.service.getemidetails(eid).subscribe({
    next: (res: any) => {
      console.log('API response:', res);

      if (res.success && res.data) {
        this.emiDetails = res.data;
        console.log('Selected EMI:', this.emiDetails);
      } else {
        console.error('EMI details not found');
      }
    },
    error: err => {
      console.error('Error fetching EMI:', err);
    }
  });
}


   emipayment = new FormGroup({
    loanaccountid : new FormControl('3'),
    emiScheduleId : new FormControl('1003'),
    paymentmode : new FormControl('UPI'),
   });

   emipayments()
   {
    this.service.emipayment(this.emipayment).subscribe({
      next:res=>{
         console.log('Emi Paid Successfully');
         
      },
      error:err=>{
         console.log(err);
      }
    })
   }


//  key: 'rzp_test_SguRsFLUPmLB46',
payEmi() {
  const eid = this.emiDetails.emiScheduleId;
  const amount = this.emiDetails.totalPayableAmount;

  this.service.createOrder(eid, amount).subscribe({
    next: (res: any) => {
      console.log('Order Created:', res);

      const options = {
        key: 'rzp_test_SguRsFLUPmLB46',
        amount: amount * 100,
        currency: 'INR',
        name: 'Loan Management System',
        description: 'EMI Payment',
        order_id: res,

        handler: (response: any) => {
          const data = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            emiScheduleId: this.emiDetails.emiScheduleId,
            paymentMode: 'UPI'
          };

          this.service.verifypay(data).subscribe({
            next: res => {
              console.log('Verification response:', res);
              alert('Emi Paid successfully');
            },
            error: err => {
              
            alert('Payment verification failed. Check console.');
            }
          });
        },

        theme: {
          color: '#3399cc'
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();
    },

    error: (err: any) => {
      console.error('Order creation failed:', err);
      alert('Unable to create payment order.');
    }
  });
}
}
