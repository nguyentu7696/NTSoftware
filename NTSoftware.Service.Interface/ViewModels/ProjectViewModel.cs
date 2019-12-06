using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class ProjectViewModel
    {
        public ProjectViewModel()
        {
        }

        public ProjectViewModel(int id, string projectName, string description, DateTime startDate, DateTime? endDate, int companyId, int managerId, int employeeCount, string managerName)
        {
            Id = id;
            ProjectName = projectName;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            CompanyId = companyId;
            ManagerId = managerId;
            this.employeeCount = employeeCount;
            ManagerName = managerName;
        }

        public int Id { get; set; }
        public string ProjectName { set; get; }
        public string Description { set; get; }
        public DateTime StartDate { set; get; }
        public DateTime? EndDate { set; get; }
        public int CompanyId { set; get; }
        public int ManagerId { set; get; }
        public string ManagerName { get; set; }
        public int  employeeCount { get; set; }
        public bool IsFinished { get; set; }
        public DateTime? ExactlyEndDate { set; get; }
    }
}
