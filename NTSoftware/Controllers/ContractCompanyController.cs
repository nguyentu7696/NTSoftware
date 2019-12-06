using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : BaseController
    {
        #region CONTRUCTOR

        private IContractCompanyService _contractCompany;
        private ICompanyDetailService _companyDetailService;
        private IUnitOfWork _unitOfWork;
        private IFunctionService _functionService;

        public ContractController(IContractCompanyService contractCompany, IUnitOfWork unitOfWork, ICompanyDetailService companyDetailService, IFunctionService functionService)
        {
            _contractCompany = contractCompany;
            _unitOfWork = unitOfWork;
            _companyDetailService = companyDetailService;
            _functionService = functionService;
        }

        #endregion CONTRUCTOR

        #region GET

        [HttpGet]
        [Route("GetAllFunction")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetAllFunction(int companyId)
        {
            try
            {
                var result = _functionService.GetAllByContract(companyId);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetCurrentContract")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetCurrentContract(int companyId)
        {
            try
            {
                var result = _contractCompany.GetCurrentContract(companyId);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetPaging")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetPaging(int companyId, int page = 1, int pageSize = 20)
        {
            try
            {
                if (page < 1)
                {
                    page = 1;
                }
                if (pageSize < 1)
                {
                    pageSize = 20;
                }
                var result = _contractCompany.GetAllPaging(page, companyId, pageSize);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetById")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetById(int contractId)
        {
            try
            {
                var result = _contractCompany.GetById(contractId);
                if (result == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CONTRACT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        #endregion GET

        #region POST

        [HttpPost]
        [Route("AddContractCompany")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult AddContractCompany([FromBody] ContractCompanyViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var result = _contractCompany.Add(Vm, _companyDetailService.GetById(Vm.CompanyId).CompanyCode);
                SaveChanges();
                _functionService.AddByOption(Vm.OptionId, result.Id);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion POST

        #region PUT

        [HttpPut]
        [Route("UpdateStatusContractCompany")]
        [Authorize(Roles = "AdminNT")]
        public async Task<IActionResult> UpdateContractCompanyAsync([FromBody] StatusContractViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                if (Vm.status == Status.Active)
                {
                    var checkCanActive = _contractCompany.CheckCanActive(Vm.companyId, Vm.contractId);
                    if (!checkCanActive)
                    {
                        var maxEmplyee = _contractCompany.GetMaxEmployee(Vm.companyId);
                        return new OkObjectResult(new GenericResult(null, false, $"{ErrorMsg.MAX_EMPLOYEE_ERROR}: {maxEmplyee}", ErrorCode.ERROR_CODE));
                    }
                    var checkDate = _contractCompany.CheckCanDateActive(Vm.companyId, Vm.contractId);
                    if (!checkDate)
                    {
                        return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CONTRACT_OUT_DATE, ErrorCode.ERROR_CODE));

                    }
                }

                var result = await _contractCompany.UpdateStatus(Vm);
                if (result == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.COMPANY_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                SaveChanges();
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion PUT

        #region DELETE
        [HttpDelete]
        [Route("Delete")]
        [Authorize(Roles = "AdminNT")]
        public async Task<IActionResult> Delete(int contractId)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var contract = _contractCompany.GetById(contractId);
                if (contract.Status == Status.Active || contract.Status == Status.Expired)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CAN_NOT_DELELE_CONTRACT, ErrorCode.ERROR_CODE));
                }
                var result = _contractCompany.Delete(contractId);
                if (result == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CONTRACT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                SaveChanges();
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion DELETE

        #region OTHER_METHOD

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        #endregion OTHER_METHOD
    }
}