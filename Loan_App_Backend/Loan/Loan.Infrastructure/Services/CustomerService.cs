using Loan.Application.DTOs;
using Loan.Application.Interface;
using Loan.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Loan.Infrastructure.Services
{
    public class CustomerService : ICustomerService
    {
        AppDbContext db;
        public CustomerService(AppDbContext db)
        {
            this.db = db;
        }

        public async Task<List<CustomerDto>> GetAllCustomers()
        {
            var customers = await db.Customers
                .Select(c => new CustomerDto
                {
                    Id = c.CustomerId,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    MonthlyIncome = c.MonthlyIncome
                })
                .ToListAsync();
            return customers;
        }

        public async Task<CustomerDto> GetCustomerById(int customerId)
        {
            var customer = await db.Customers
                .Where(c => c.CustomerId == customerId)
                .Select(c => new CustomerDto
                {
                    Id = c.CustomerId,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    MonthlyIncome = c.MonthlyIncome
                })
                .FirstOrDefaultAsync();
            return customer;
        }
    }
}
