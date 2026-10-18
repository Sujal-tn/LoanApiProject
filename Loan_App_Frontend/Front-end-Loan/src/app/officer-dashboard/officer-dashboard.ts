
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './officer-dashboard.html',
  styleUrl: './officer-dashboard.scss'
})
export class OfficerDashboard {
  private router = inject(Router);
  private authService = inject(AuthService);

  openMenus: Record<string, boolean> = {
    customers: false,
    loans: false,
    requests: false
  };

  toggleMenu(menu: string): void {
    this.openMenus[menu] = !this.openMenus[menu];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
