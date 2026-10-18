using Loan.Application.DTOs;
using Loan.Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Loan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        ICustomerService service;
        public CustomerController(ICustomerService service)
        {
            this.service = service;
        }

        [Authorize(Roles = "LoanOfficer,Officer")]
        [HttpGet]
        [Route("GetAllCustomers")]
        public async Task<ActionResult<List<CustomerDto>>> GetAllCustomers()
        {
            var customers = await service.GetAllCustomers();
            return Ok(customers);
        }

        [Authorize(Roles = "LoanOfficer,Officer")]
        [HttpGet]
        [Route("GetCustomerById/{customerId}")]
        public async Task<ActionResult<CustomerDto>> GetCustomerById(int customerId)
        {
            var customer = await service.GetCustomerById(customerId);
            return Ok(customer);
        }
    }
}
