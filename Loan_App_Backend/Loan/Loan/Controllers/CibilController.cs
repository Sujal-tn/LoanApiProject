using Loan.Application.Interface;
using Loan.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Loan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CibilController : ControllerBase
    {
        ICibilService service;
        public CibilController(ICibilService service)
        {
            this.service = service;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        [Route("calculate")]
        public async Task<IActionResult> GetCibilScoreReport()
        {
            string? customerIdValue = User.FindFirst("CustomerId")?.Value;
            if (!int.TryParse(customerIdValue, out int customerId))
            {
                return Unauthorized("Customer ID was not found in the login token.");
            }

            var report = await service.GetCibilScore(customerId);

            if (report == null)
            {
                return NotFound("Customer not found");
            }

            var result = new
            {
                report.CibilReportId,
                report.CustomerId,
                CustomerName = report.Customer != null? report.Customer.FirstName + " " + report.Customer.LastName: "",
                report.PanNo,
                EmploymentType = report.Customer?.EmploymentType ?? "",
                TotalMonthlyDebt = report.Customer?.TotalMonthlyDebt ?? 0,
                report.CibilScore,
                report.CheckDate
            };

            var response = new ApiResponse<object>
            {
                Success = true,
                Message = "CIBIL report generated successfully",
                Data = result,
                Error = null
            };

            return Ok(response);
        }

        [Authorize(Roles = "Customer")]
        [HttpGet]
        [Route("latest")]
        public async Task<IActionResult> GetLatestCibil()
        {
            string? customerIdValue = User.FindFirst("CustomerId")?.Value;
            if (!int.TryParse(customerIdValue, out int customerId))
            {
                return Unauthorized("Customer ID was not found in the login token.");
            }

            var report = await service.GetLatestCibil(customerId);

            if (report == null)
            {
                return NotFound("No CIBIL report found for this customer");
            }

            var result = new
            {
                report.CibilReportId,
                report.CustomerId,
                CustomerName = report.Customer != null ? report.Customer.FirstName + " " + report.Customer.LastName : "",
                report.PanNo,
                EmploymentType = report.Customer?.EmploymentType ?? "",
                TotalMonthlyDebt = report.Customer?.TotalMonthlyDebt ?? 0,
                report.CibilScore,
                report.CheckDate
            };
            var response = new ApiResponse<object>
            {
                Success = true,
                Message = "Latest CIBIL report retrieved successfully",
                Data = result,
                Error = null
            };

            return Ok(response);
        }
    }
}
