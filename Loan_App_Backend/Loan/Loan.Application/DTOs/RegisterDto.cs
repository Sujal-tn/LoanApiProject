using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using System.Text.Json.Serialization;

namespace Loan.Application.DTOs
{
    public class RegisterDto
    {
        [Required, RegularExpression(@"^[A-Za-z]{2,12}$")]
        public string FirstName { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[A-Za-z]{2,12}$")]
        public string LastName { get; set; } = string.Empty;

        [Range(18, 60)]
        public int Age { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[6-9]\d{9}$")]
        public string MobileNo { get; set; } = string.Empty;

        [Required, RegularExpression(@"^[A-Z]{5}[0-9]{4}[A-Z]$")]
        public string Pan { get; set; } = string.Empty;

        [Required, RegularExpression(@"^\d{12}$")]
        public string AadhaarNo { get; set; } = string.Empty;

        [Required]
        [RegularExpression("(?i)^(Government|Private|Self-Employed)$", ErrorMessage = "EmploymentType must be Government, Private, or Self-Employed.")]
        public string EmploymentType { get; set; } = string.Empty;

        [Range(typeof(decimal), "1000", "10000000")]
        public decimal MonthlyIncome { get; set; }

        [Range(typeof(decimal), "0", "10000000")]
        [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
        public decimal TotalMonthlyDebt { get; set; }
    }
}
