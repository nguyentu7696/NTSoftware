using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface
{
    public interface IOptionContractService
    {
        #region GET
        List<OptionContractViewModel> GetAll();
        PagedResult<OptionContractViewModel> GetPaging(int page, int pageSize);

        #endregion GET

        #region POST

        Option Add(OptionContractViewModel Vm);

        #endregion POST

        #region PUT
        bool Update(OptionContractViewModel Vm);

        #endregion PUT

        #region DELETE
        bool Delete(int id);

        #endregion DELETE

    }
}
