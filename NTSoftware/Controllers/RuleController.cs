using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RuleController : BaseController
    {
        #region CONTRUCTOR
        private IRuleService _ruleService;
        private ICompanyDetailService _companyDetailService;

        public RuleController(IRuleService ruleService, ICompanyDetailService companyDetailService)
        {
            _ruleService = ruleService;
            _companyDetailService = companyDetailService;
        }
        #endregion CONTRUCTOR

        #region GET
        [HttpGet]
        [Route("GetAll")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetAll(int companyId)
        {
            try
            {
                var company = _companyDetailService.CheckCompanyExpried(companyId);
                if(company!=null && companyId != 0)
                {
                    return new OkObjectResult(company);
                }
                var result = _ruleService.GetAll(companyId);
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
        public IActionResult GetById(int id)
        {
            try
            {
                var result = _ruleService.GetById(id);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetPaging")]
        [Authorize(Roles = "AdminCompany, AdminNT")]
        public IActionResult GetPaging(int companyId, int pageIndex = 1, int pageSize = 20)
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
                var result = _ruleService.GetAllPaging(pageIndex, pageSize, companyId);
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
        [Route("Add")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult Add([FromBody] RuleViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var companyExpried = _companyDetailService.CheckCompanyExpried(Vm.CompanyId);
                if (companyExpried != null && Vm.CompanyId != 0)
                {
                    return new OkObjectResult(companyExpried);
                }
                var checkExist = _ruleService.CheckRuleExist(Vm.CompanyId, Vm.TypeContractName);
                if (checkExist)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.RULE_EXIST, ErrorCode.ERROR_CODE));
                }
                var result = _ruleService.Add(Vm);
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
        [Route("Update")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult Update([FromBody] RuleViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var companyExpried = _companyDetailService.CheckCompanyExpried(Vm.CompanyId);
                if (companyExpried != null && Vm.CompanyId != 0)
                {
                    return new OkObjectResult(companyExpried);
                }
                 _ruleService.Update(Vm);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE)) ;
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
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult Delete(int id)
        {
            try
            {
                _ruleService.Delete(id);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        #endregion DELETE
    }
}