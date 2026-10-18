import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, AuthResponse, RegisterRequest } from '../auth-service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  service = inject(AuthService);
  router = inject(Router);

  mode = 'login';
  message = '';
  challengeId = '';
  qrCode = '';
  loading = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  registerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    age: new FormControl(21),
    email: new FormControl(''),
    password: new FormControl(''),
    mobileNo: new FormControl(''),
    pan: new FormControl(''),
    aadhaarNo: new FormControl(''),
    employmentType: new FormControl(''),
    monthlyIncome: new FormControl(0),
    totalMonthlyDebt: new FormControl(0),
  });

  otpForm = new FormGroup({
    otp: new FormControl(''),
  });

  showRegister(): void {
    this.mode = 'register';
    this.message = '';
  }

  showLogin(): void {
    this.mode = 'login';
    this.message = '';
  }

  // GOOGLE SIGN-IN
  signInWithGoogle(): void {
    this.message = '';
    window.location.href = 'https://localhost:44365/api/Auth/GoogleLogin';
  }

  register(): void {
    this.loading = true;
    this.message = '';

    const request: RegisterRequest = this.registerForm.getRawValue();

    this.service.Register(request).subscribe({
      next: (res: AuthResponse) => {
        this.loading = false;

        if (res.success) {
          this.mode = 'registerOtp';
          this.message = res.message || 'OTP sent to your email.';
        } else {
          this.message = res.message || 'Registration failed.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Registration error:', err);
        this.message = this.getApiErrorMessage(err, 'Registration failed.');
      },
    });
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    const response = error?.error;
    if (typeof response?.message === 'string' && response.message.trim()) {
      return response.message;
    }

    if (response?.errors && typeof response.errors === 'object') {
      const validationMessages = Object.values(response.errors)
        .flatMap((messages) => Array.isArray(messages) ? messages : [messages])
        .filter((message): message is string => typeof message === 'string' && message.trim().length > 0);

      if (validationMessages.length > 0) {
        return validationMessages.join(' ');
      }
    }

    return fallback;
  }

  verifyRegistrationOtp(): void {
    this.loading = true;
    this.message = '';

    this.service
      .VerifyRegistrationOtp({
        email: this.registerForm.controls.email.value,
        otp: this.otpForm.controls.otp.value,
      })
      .subscribe({
        next: (res: AuthResponse) => {
          this.loading = false;

          if (res.success) {
            this.loginForm.patchValue({
              email: this.registerForm.controls.email.value,
            });

            this.mode = 'login';
            this.otpForm.reset();
            this.message = 'Registration successful. Please log in.';
          } else {
            this.message = res.message || 'Invalid OTP.';
          }
        },
        error: (err: any) => {
          this.loading = false;
          this.message = err.error?.message || 'OTP verification failed.';
        },
      });
  }

  login(): void {
    this.loading = true;
    this.message = '';

    this.service.Login(this.loginForm.getRawValue()).subscribe({
      next: (res: AuthResponse) => {
        if (!res.success) {
          this.loading = false;
          this.message = res.message || 'Login failed.';
          return;
        }

        this.challengeId = res.challengeId || '';

        if (res.requires2FASetup) {
          this.service
            .Setup2FA({
              challengeId: this.challengeId,
            })
            .subscribe({
              next: (setupRes: AuthResponse) => {
                this.loading = false;

                if (!setupRes.success) {
                  this.message = setupRes.message || '2FA setup failed.';
                  return;
                }

                this.challengeId = setupRes.challengeId || this.challengeId;
                this.qrCode = setupRes.qrCode || '';
                this.mode = 'loginOtp';
                this.message = 'Scan the QR code and enter your authenticator code.';
              },
              error: (err: any) => {
                this.loading = false;
                this.message = err.error?.message || '2FA setup failed.';
              },
            });
        } else {
          this.loading = false;
          this.mode = 'loginOtp';
          this.message = 'Enter your authenticator code.';
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.message = err.error?.message || 'Login failed.';
      },
    });
  }

  verifyLoginOtp(): void {
    this.loading = true;
    this.message = '';

    this.service
      .VerifyOTP({
        challengeId: this.challengeId,
        otp: this.otpForm.controls.otp.value,
      })
      .subscribe({
        next: (res: AuthResponse) => {
          this.loading = false;

          if (!res.success || !res.token) {
            this.message = res.message || 'OTP verification failed.';
            return;
          }

          const role = (res.role || '').toLowerCase();

          if (role !== 'customer' && role !== 'loanofficer' && role !== 'loan officer') {
            this.message = 'Unknown user role. Contact your administrator.';
            return;
          }

          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role || '');

          if (role === 'customer') {
  this.router.navigate(['/customer/dashboard']);
} else {
  this.router.navigate(['/officer/dashboard']);
}
        },
        error: (err: any) => {
          this.loading = false;
          this.message = err.error?.message || 'OTP verification failed.';
        },
      });
  }
}
