using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeContractController : BaseController
    {

        #region CONTRUCTOR

        private IEmployeeContractService _employeeContractService;
        private ICompanyDetailService _companyDetailService;
        private IUnitOfWork _unitOfWork;

        public EmployeeContractController(IEmployeeContractService employeeContractService, ICompanyDetailService companyDetailService, IUnitOfWork unitOfWork)
        {
            _employeeContractService = employeeContractService;
            _companyDetailService = companyDetailService;
            _unitOfWork = unitOfWork;
        }

        #endregion CONTRUCTOR

        #region GET

        [HttpGet]
        [Route("GetById")]
        [Authorize(Roles = "AdminCompany,Emoloyee")]
        public IActionResult GetById(int id)
        {
            try
            {
                var data = _employeeContractService.GetById(id);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.ERROR_CODE));
            }
        }
        [HttpGet]
        [Route("GetByEmployee")]
        [Authorize(Roles = "AdminCompany,Emoloyee")]
        public IActionResult GetByEmployee(string employeeId, int pageIndex = 1, int pageSize = 20)
        {
            try
            {
                if (pageIndex < 1)
                {
                    pageIndex = 1;
                }
                if (pageSize < 1)
                {
                    pageSize = 20;
                }
                //var companyExpired = _companyDetailService.CheckCompanyExpried(companyId);
                //if (companyExpired != null)
                //{
                //    return new OkObjectResult(companyExpired);
                //}
                var data = _employeeContractService.GetAllPaging(pageIndex, pageSize, employeeId);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.ERROR_CODE));
            }
        }
        #endregion GET

        #region POST

        [HttpPost]
        [Route("Add")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult Add([FromBody] EmployeeContractViewModel Vm)
        {
            try
            {
                var companyExpired = _companyDetailService.CheckCompanyExpried(Vm.CompanyId);
                if (companyExpired != null)
                {
                    return new OkObjectResult(companyExpired);
                }
                var data = _employeeContractService.Add(Vm, _companyDetailService.GetById(Vm.CompanyId).CompanyCode);
                SaveChanges();
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.ERROR_CODE));
            }
        }

        #endregion POST

        #region PUT

        [HttpPut]
        [Route("UpdateStatusEmployee")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult UpdateStatusEmployee([FromBody] StatusContractEmployee Vm)
        {
            try
            {
                if (Vm.employeeId == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_CODE)); ;
                }
                if (Vm.status == Status.New)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.STATUS_ERROR, ErrorCode.ERROR_CODE)); ;
                }

                var result = _employeeContractService.UpdateStatusEmployee(Vm);
                if (result == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.NOT_EXIST_EM_CONTRACT, ErrorCode.ERROR_CODE));
                }
                SaveChanges();
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.ERROR_CODE));
            }
        }

        #endregion PUT

        #region DELETE

        [HttpDelete]
        [Route("Delete")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult Delete(int id)
        {
            try
            {
                var contract = _employeeContractService.GetById(id);
                if(contract == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CONTRACT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                if (contract.Status!=Status.New)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CAN_NOT_DELELE_CONTRACT, ErrorCode.ERROR_CODE));
                }
                _employeeContractService.Delete(id);
                SaveChanges();
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.ERROR_CODE));
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