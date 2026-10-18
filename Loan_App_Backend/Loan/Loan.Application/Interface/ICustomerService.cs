using Hangfire.Storage.Monitoring;
using Loan.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Loan.Application.Interface
{
    public interface ICustomerService
    {
        Task<CustomerDto> GetCustomerById(int customerId);
        Task<List<CustomerDto>> GetAllCustomers();
    }
}