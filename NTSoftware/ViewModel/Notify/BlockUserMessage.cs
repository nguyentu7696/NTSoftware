using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.ViewModel.Notify
{
    public class BlockUserMessage
    {
        public int CompanyId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
    }
}
