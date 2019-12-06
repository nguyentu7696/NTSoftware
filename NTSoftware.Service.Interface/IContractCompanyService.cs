using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface.ViewModels;

using System;
using System.Collections.Generic;

using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Service.Interface
{
    public interface IContractCompanyService
    {
        #region GET

        ContractCompanyViewModel GetById(int id);
        ContractCompanyViewModel GetCurrentContract(int companyId);
        PagedResult<ContractCompanyViewModel> GetAllPaging(int page,int companyId, int pageSize);

        #endregion GET

        #region POST

        ContractCompany Add(ContractCompanyViewModel vm, string companyCode);

        #endregion POST

        #region PUT

        void Update(ContractCompanyViewModel vm);
        Task<bool> UpdateStatus(StatusContractViewModel vm);

        #endregion PUT

        #region DELETE

        bool Delete(int id);

        #endregion DELETE

        #region OTHER
        bool CheckCanDelete(int companyId);
        bool CheckMaxEmployee(int companyId);
        bool CheckCanActive( int companyId, int contractId);
        bool CheckCanDateActive( int companyId, int contractId);
        int GetMaxEmployee(int companyId);

        #endregion OTHER

    }
}
