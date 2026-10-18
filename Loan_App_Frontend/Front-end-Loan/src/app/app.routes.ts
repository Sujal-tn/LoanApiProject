
import { Routes } from '@angular/router';
import { Cibil } from './cibil/cibil';
import { CustomerList } from './customer-list/customer-list';
import { ScoreCard } from './scorecard/scorecard';
import { EligibilityResult } from './eligibilityresult/eligibilityresult';
import { ManualReview } from './manualreview/manualreview';



import { Auth } from './auth/auth';
import { CustomerDashboard } from './customer-dashboard/customer-dashboard';
import { OfficerDashboard } from './officer-dashboard/officer-dashboard';
import { OfficerKyc } from './officer-kyc/officer-kyc';
import { CustomerKyc } from './customer-kyc/customer-kyc';
import { EmiPayment } from './emi-payment/emi-payment';
import { ForeClosure } from './fore-closure/fore-closure';

import { ApplyLoanComponent } from './pages/apply-loan/apply-loan';
import { LoanDealComponent } from './pages/loan-deal/loan-deal';
import { SanctionComponent } from './pages/sanction/sanction';
import { DisbursementComponent } from './pages/disbursement/disbursement';
import { EmiSchedules } from './emi-schedules/emi-schedules';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Auth },

  { path: 'officer/dashboard', component: OfficerDashboard },
  { path: 'customer/dashboard', component: CustomerDashboard },

  { path: 'officer-dashboard', redirectTo: 'officer/dashboard' },
  { path: 'customer-dashboard', redirectTo: 'customer/dashboard' },

  { path: 'customer/kyc', component: CustomerKyc },
  { path: 'officer/kyc', component: OfficerKyc },
  { path: 'customer/profile', redirectTo: 'customer/dashboard', pathMatch: 'full' },
  { path: 'customer/cibil-score', redirectTo: 'cibil', pathMatch: 'full' },
  { path: 'customer/eligibility-result', redirectTo: 'eligibility', pathMatch: 'full' },
  { path: 'customer/track-status', redirectTo: 'loan-deal', pathMatch: 'full' },
  { path: 'customer/foreclosure-request', redirectTo: 'foreclosure', pathMatch: 'full' },
  { path: 'customer/emi-schedule', redirectTo: 'emischedule', pathMatch: 'full' },
  { path: 'customer/make-payments', redirectTo: 'emi', pathMatch: 'full' },
  { path: 'customer/payment-history', redirectTo: 'emi', pathMatch: 'full' },
  { path: 'customer/my-penalties', redirectTo: 'emi', pathMatch: 'full' },
  { path: 'customer/support', redirectTo: 'customer/dashboard', pathMatch: 'full' },
  { path: 'officer/customers', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'officer/eligibility-check', redirectTo: 'manual-review', pathMatch: 'full' },
  { path: 'officer/score-cards', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'officer/loan-applications', redirectTo: 'apply-loan', pathMatch: 'full' },
  { path: 'officer/closure-requests', redirectTo: 'foreclosure', pathMatch: 'full' },
  { path: 'officer/penalty-charges', redirectTo: 'emi', pathMatch: 'full' },
  { path: 'officer/support-tickets', redirectTo: 'officer/dashboard', pathMatch: 'full' },

  { path: 'cibil', component: Cibil },
  { path: 'customers', component: CustomerList },
  { path: 'scorecard/:id', component: ScoreCard },
  { path: 'eligibility', component: EligibilityResult },
  { path: 'manual-review', component: ManualReview },
   { path: 'emischedule', component: EmiSchedules },
  { path: 'emi', component: EmiPayment },
  { path: 'foreclosure', component: ForeClosure },

  { path: 'apply-loan', component: ApplyLoanComponent },
  { path: 'loan-deal', component: LoanDealComponent },
  { path: 'sanction', component: SanctionComponent },
  { path: 'disbursement', component: DisbursementComponent },

  { path: '**', redirectTo: 'login' }

];
