using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class DepartmentViewModel
    {
        public DepartmentViewModel()
        {

        }
        public int Id { get; set; }
        public string DepartmentName { set; get; }
        public string PhoneNumber { set; get; }
        public string Email { set; get; }
        public string Address { set; get; }
        public string Description { set; get; }
        public int ManagerId { set; get; }
        public string ManagerName { get; set; }
        public int CompanyId { set; get; }
        public int EmployeeCount { get; set; }
    }
}
