import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Customer, CustomerService } from '../customer-service';

@Component({
  selector: 'app-customer-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList {
  constructor(private service: CustomerService) {
    this.getAllCustomers();
  }

  allcustomers = signal<Customer[]>([]);
  errorMessage = signal('');

  getAllCustomers() {
    this.service.getCustomers().subscribe({
      next: (customers) => {
        this.allcustomers.set(customers);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage.set('Could not load customers. Is the API running?');
      },
    });
  }
}
