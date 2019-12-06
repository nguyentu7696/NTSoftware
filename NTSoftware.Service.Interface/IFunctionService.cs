using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Service.Interface
{
   public interface IFunctionService
    {
        #region GET
        List<FunctionViewModel> GetAllByContract(int companyId);

        #endregion GET

        #region 

        void AddByOption(int optionId, int contractId);

        #endregion POST

        #region OTHER_METHOD

        bool CheckHasFunction(int companyId, string functionName);

        #endregion OTHER_METHOD
    }
}
