using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Helper;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : BaseController
    {
        #region CONTRUCTOR

        private IDepartmentService _departmentService;
        private IUnitOfWork _unitOfWork;
        private ICompanyDetailService _companyDetailService;
        private IAppUserService _appUserService;
        private IFunctionService _functionService;

        public DepartmentController(IDepartmentService departmentService, IUnitOfWork unitOfWork, ICompanyDetailService companyDetailService, IAppUserService appUserService, IFunctionService functionService)
        {
            _departmentService = departmentService;
            _unitOfWork = unitOfWork;
            _companyDetailService = companyDetailService;
            _appUserService = appUserService;
            _functionService = functionService;
        }

        #endregion CONTRUCTOR

        #region GET

        [HttpGet]
        [Route("CheckPermission")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult CheckPermission(int companyId)
        {
            try
            {
                //var companyExist = _companyDetailService.CheckCompanyExpried(companyId);
                //if (companyExist != null)
                //{
                //    return new OkObjectResult(companyExist);
                //}
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }

                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        [HttpGet]
        [Route("GetPaging")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetPaging(int companyId, int page = 1, int pageSize = 20)
        {
            try
            {
                //var companyExist = _companyDetailService.CheckCompanyExpried(companyId);
                //if (companyExist != null)
                //{
                //    return new OkObjectResult(companyExist);
                //}
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                if (page < 1)
                {
                    page = 1;
                }
                if (pageSize < 1)
                {
                    pageSize = 20;
                }
                var result = _departmentService.GetAllPaging(page, pageSize, companyId);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        [HttpGet]
        [Route("GetById")]
        //[Authorize(Roles = "AdminCompany")]
        public IActionResult GetById(int companyId, int id)
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                //var companyExist = _companyDetailService.CheckCompanyExpried(companyId);
                //if (companyExist != null)
                //{
                //    return new OkObjectResult(companyExist);
                //}
                var result = _departmentService.GetById(id, companyId);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        #endregion GET


        #region POST

        [HttpPost]
        [Route("Add")]
        [Authorize(Roles = "AdminCompany")]
        public async Task<IActionResult> Add([FromBody] DetailDepartmentViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var checkFunction = _functionService.CheckHasFunction(Vm.CompanyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                //var companyExist = _companyDetailService.CheckCompanyExpried(Vm.CompanyId);
                //if (companyExist != null)
                //{
                //    return new OkObjectResult(companyExist);
                //}
                var checkUser = _appUserService.CheckListUserInCompanyAsync(Vm.lstEmployee, Vm.CompanyId);
                if (checkUser == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMPLOYEE_NOT_EXIST_IN_COMPANY, ErrorCode.ERROR_CODE));

                }
                var result = _departmentService.Add(Vm);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        #endregion POST

        #region PUT

        [HttpPut]
        [Route("Update")]
        [Authorize(Roles = "AdminCompany")]
        public async Task<IActionResult> Update([FromBody] DetailDepartmentViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var checkFunction = _functionService.CheckHasFunction(Vm.CompanyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                //var department = _departmentService.GetById(Vm.Id, Vm.CompanyId);
                //if (department == null)
                //{
                //    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.DEPARTMENT_NOT_EXIST, ErrorCode.ERROR_CODE));
                //}
                var checkUser = _appUserService.CheckListUserInCompanyAsync(Vm.lstEmployee, Vm.CompanyId);
                if (checkUser == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMPLOYEE_NOT_EXIST_IN_COMPANY, ErrorCode.ERROR_CODE));

                }
                var result = _departmentService.Update(Vm);
                if (result == false)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.DEPARTMENT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        #endregion PUT

        #region DELETE

        [HttpDelete]
        [Route("Delete")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult Delete(int id, int companyId)
        {
            try
            {
                //var companyExist = _companyDetailService.CheckCompanyExpried(companyId);
                //if (companyExist != null)
                //{
                //    return new OkObjectResult(companyExist);
                //}
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.DEPARTMENT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                var department = _departmentService.GetById(id, companyId);
                if (department == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.DEPARTMENT_NOT_EXIST, ErrorCode.ERROR_CODE));

                }
                var lstEmployee = _departmentService.GetEmployeeCount(companyId);
                if (department.lstEmployee.Count > 0)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.DEPARTMENT_HAS_EMPLOYEE, ErrorCode.DEPARTMENT_HAS_EMPLOYEE));
                }
                _departmentService.Delete(id);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
        }

        #endregion DELETE

        #region OTHER_METHOD

        #endregion OTHER_METHOD


    }
}