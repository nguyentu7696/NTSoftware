using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface
{
    public interface IDetailUserService
    {
        #region GET

        DetailUserViewModel GetById(int id);
        List<SelectUserViewModel> GetUserWithoutDepartment(List<string> lstVm, int companyId, string keyword, int departmentId);
        List<SelectUserViewModel> GetAll(int companyId);
        List<DetailUserViewModel> GetUserInProject(int projectId);
        List<SelectUserViewModel> GetSelectProject(List<string> lstVm, int companyId, string keyword);
        PagedResult<SelectUserViewModel> GetPaging(int page, int companyId, int pageSize, string name,string contractNumber);

        #endregion GET

        #region POST

        DetailUser Add(DetailUserViewModel vm, string companyCode, int companyId);

        #endregion POST

        #region PUT

        void Update(DetailUserViewModel vm);
        void UpdateAdmin(UserAdminViewModel vm);

        #endregion PUT

        #region DELETE
        bool CheckCanDelete(int id);
        void Delete(int id);

        #endregion DELETE

    }
}
