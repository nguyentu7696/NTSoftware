using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Repository.Interface
{
    public interface IDetailUserRepository : IRepository<DetailUser, int>
    {
        List<SelectUserViewModel> GetUserWithoutDepartment(List<string> lstSelected, int companyId, string keyword, int departmentId);
        List<SelectUserViewModel> GetSelectProject(List<string> lstSelected, int companyId, string keyword);
        List<SelectUserViewModel> GetLstEmployee( int companyId, string name,string contractNumber);
        List<SelectUserViewModel> GetAll( int companyId);
        
    }
}
