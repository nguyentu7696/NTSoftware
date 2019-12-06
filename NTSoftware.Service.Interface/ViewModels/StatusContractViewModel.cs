using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class StatusContractViewModel
    {
        public int companyId { get; set; }
        public int contractId { get; set; }

        [RequiredEnumAttribute(ErrorMessage = "Trạng thái không hợp lệ")]
        [EnumWithoutNew(ErrorMessage = "Không thể đổi thành trạng thái tạo mới")]
        public Status status { get; set; }
        [StatusCheck("status", ErrorMessage = "Lý do kết thúc hợp đồng không được trống")]
        public string ReasonEnd { get; set; }
        public bool IsBreak { get; set; }
    }
}
