using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class LogUsedTimeViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string EmployeeName { get; set; }
        public int CompanyId { get; set; }
        public DateTime LogedTime { get; set; }
        public DateTime LogoutTime { get; set; }
        public int SecondUsed { get; set; }
        public bool IsPayed { get; set; }
        public decimal Price { get; set; }


    }
}
