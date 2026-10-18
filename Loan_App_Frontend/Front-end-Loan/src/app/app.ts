import { Component, DestroyRef, inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  currentUrl = signal(this.router.url);
  openMenus: { [key: string]: boolean } = {
    customer: true,
    loans: false,
    payments: false,
    customers: true,
    requests: false
  };

  notificationCount = 0;

  constructor() {
    const subscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.currentUrl.set(event.urlAfterRedirects));

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  get isLoginPage(): boolean {
    return this.currentUrl() === '/login';
  }

  get isDashboardPage(): boolean {
    return this.currentUrl().startsWith('/customer/dashboard') ||
      this.currentUrl().startsWith('/officer/dashboard');
  }

  get showNavigation(): boolean {
    return !this.isLoginPage && !this.isDashboardPage;
  }

  get isOfficer(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return ['loanofficer', 'loan officer'].includes(
      (localStorage.getItem('role') || '').toLowerCase()
    );
  }

  toggleMenu(menu: string) {
    this.openMenus[menu] = !this.openMenus[menu];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}