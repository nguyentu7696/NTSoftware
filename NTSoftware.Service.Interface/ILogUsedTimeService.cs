using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface
{
   public interface ILogUsedTimeService
    {
        #region GET

        PagedResult<LogUsedTimeViewModel> GetPagingByCompany(int companyId,int month,int year,int pageIndex,int pageSize,bool isPayed);
        double GetTotalByMonth(int month, int year, int companyId,bool isPayed);

        #endregion GET

        #region POST

        void SetLogIn(int userId, int companyId);
        void SetLogOut(int userId,int companyId);

        #endregion POST

        #region PUT

        void PayByMonth(int month, int year, int companyId);

        #endregion PUT

        #region DELETE

        #endregion DELETE

        #region OTHER


        #endregion OTHER
    }
}
