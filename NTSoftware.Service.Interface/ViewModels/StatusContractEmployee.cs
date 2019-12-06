using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class StatusContractEmployee
    {
        public string employeeId { get; set; }
        public int contractId { get; set; }

        [RequiredEnumAttribute(ErrorMessage = "Trạng thái không hợp lệ")]
        public Status status { get; set; }

    }
}
