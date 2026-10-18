
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KycService, KycDocument } from '../kyc-service';

@Component({
  selector: 'app-customer-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-kyc.html',
  styleUrl: './customer-kyc.scss'
})
export class CustomerKyc implements OnInit {
  private kycService = inject(KycService);

  documentType = '';
  selectedFile: File | null = null;

  documents: KycDocument[] = [];

  loading = false;
  uploading = false;

  errorMessage = '';
  successMessage = '';

  documentTypes: string[] = [
    'PAN Card',
    'Aadhaar Card',
    'Address Proof',
    'Income Proof',
    'Bank Statement',
    'Other'
  ];

  ngOnInit(): void {
    this.loadDocuments();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage = '';
    this.successMessage = '';

    if (!file) {
      this.selectedFile = null;
      return;
    }

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (!allowedExtensions.includes(extension)) {
      this.errorMessage =
        'Only PDF, JPG, JPEG and PNG files are allowed.';
      this.selectedFile = null;
      input.value = '';
      return;
    }

    if (file.size === 0) {
      this.errorMessage = 'The selected file is empty.';
      this.selectedFile = null;
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'File size must not exceed 5 MB.';
      this.selectedFile = null;
      input.value = '';
      return;
    }

    this.selectedFile = file;
  }

  uploadDocument(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.documentType) {
      this.errorMessage = 'Please select a document type.';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a document file.';
      return;
    }

    this.uploading = true;

    this.kycService
      .UploadDocument(this.documentType, this.selectedFile)
      .subscribe({
        next: (response) => {
          this.successMessage =
            response.message || 'Document uploaded successfully.';

          this.documentType = '';
          this.selectedFile = null;

          const fileInput = document.getElementById(
            'documentFile'
          ) as HTMLInputElement | null;

          if (fileInput) {
            fileInput.value = '';
          }

          this.uploading = false;
          this.loadDocuments();
        },
        error: (error) => {
          this.errorMessage =
            error.error?.message ||
            'Document upload failed. Please try again.';
          this.uploading = false;
        }
      });
  }

  loadDocuments(): void {
    this.loading = true;

    this.kycService.GetMyDocuments().subscribe({
      next: (response) => {
        this.documents = response;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Could not load documents. Please check your login.';
        this.loading = false;
      }
    });
  }

  statusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  }
}
