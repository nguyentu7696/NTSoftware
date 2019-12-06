using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Service.Interface
{
    public interface IAppUserService
    {
        #region GET
        AppUser GetById(int id);
        AppUser GetByUserName(string userName);

        PagedResult<AppUserViewModel> GetAllPaging(int page, int pageSize);

        #endregion GET

        #region POST

        AppUser Add(AppUserViewModel Vm);

        #endregion POST

        #region PUT

        void UpdateAsync(AppUserViewModel userVm);
        void ToggleUser(int userId,bool isLocked);
        void ChangePassword(AppUser user, string password);

        #endregion PUT

        #region DELETE

        void DeleteUser(int id);

        #endregion DELETE

        #region OTHER_METHOD

        void RemoveDepartment(int departmentId);
        void AddDepartment(List<int> lstVm, int departmentId);
        bool PasswordSignInAsync(string userName, string password);

        bool CheckListUserInCompanyAsync(List<int> userIdLst, int companyId);
        string GeneratePasswordResetTokenAsync(AppUser user);
        bool CheckTokenChangePassword(AppUser user, string token);
        #endregion OTHER_METHOD
    }
}
