using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    public class LogUsedTime : DomainEntity<int>
    {
        public int UserId { get; set; }
        public int CompanyId { get; set; }
        public DateTime LogedTime { get; set; }
        public DateTime LogoutTime { get; set; }
        public int SecondUsed { get; set; }
        public bool IsPayed { get; set; }
        public decimal Price { get; set; }
    }
}
