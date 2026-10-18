
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss'
})
export class CustomerDashboard {
  private router = inject(Router);
  private authService = inject(AuthService);

  openMenus: Record<string, boolean> = {
    customer: true,
    loans: false,
    payments: false
  };

  notificationCount = 4;

  toggleMenu(menu: string): void {
    this.openMenus[menu] = !this.openMenus[menu];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
