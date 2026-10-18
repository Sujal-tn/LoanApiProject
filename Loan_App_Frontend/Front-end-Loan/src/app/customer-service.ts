import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  monthlyIncome: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http = inject(HttpClient);

  url = 'https://localhost:44365/api/Customer/GetAllCustomers';
  getCustomers() {
    return this.http.get<Customer[]>(this.url);
  }

  url1="https://localhost:44365/api/Customer/GetCustomerById";
  getCustomer(customerId:number)
  {
    return this.http.get<any>(this.url1+customerId);
  }
}
