using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.ViewModel.Auth
{
    public class ToggleEmployeeViewModel
    {
        public int UserId { get; set; }
        public bool isLocked { get; set; }
        public int CompanyId { get; set; }
    }
}
