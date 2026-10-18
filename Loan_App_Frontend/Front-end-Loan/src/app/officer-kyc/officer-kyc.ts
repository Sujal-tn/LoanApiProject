
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KycService, KycDocument } from '../kyc-service';

@Component({
  selector: 'app-officer-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-kyc.html',
  styleUrl: './officer-kyc.scss'
})
export class OfficerKyc implements OnInit {
  private kycService = inject(KycService);

  documents: KycDocument[] = [];

  loading = false;
  processing = false;

  errorMessage = '';
  successMessage = '';

  rejectingDocumentId: number | null = null;
  rejectionReason = '';

  ngOnInit(): void {
    this.loadPendingDocuments();
  }

  loadPendingDocuments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.kycService.GetPendingDocuments().subscribe({
      next: (response) => {
        this.documents = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Unable to load pending documents. Please check your officer login.';
        this.loading = false;
      }
    });
  }

  approveDocument(documentId: number): void {
    const confirmed = window.confirm(
      'Are you sure you want to approve this KYC document?'
    );

    if (!confirmed) {
      return;
    }

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.kycService.ApproveDocument(documentId).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Document approved successfully.';

        this.rejectingDocumentId = null;
        this.rejectionReason = '';
        this.processing = false;

        this.loadPendingDocuments();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to approve this document.';
        this.processing = false;
      }
    });
  }

  openRejectForm(documentId: number): void {
    this.rejectingDocumentId = documentId;
    this.rejectionReason = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelReject(): void {
    this.rejectingDocumentId = null;
    this.rejectionReason = '';
    this.errorMessage = '';
  }

  rejectDocument(documentId: number): void {
    const reason = this.rejectionReason.trim();

    if (!reason) {
      this.errorMessage = 'Please enter a reason for rejection.';
      return;
    }

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.kycService.RejectDocument(documentId, reason).subscribe({
      next: (response) => {
        this.successMessage =
          response.message || 'Document rejected successfully.';

        this.rejectingDocumentId = null;
        this.rejectionReason = '';
        this.processing = false;

        this.loadPendingDocuments();
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message || 'Unable to reject this document.';
        this.processing = false;
      }
    });
  }
}
