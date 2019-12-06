using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Helper;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : BaseController
    {
        #region CONTRUCTOR

        private IProjectService _projectService;
        private IEmployeeProjectService _employeeProjectService;
        private ICompanyDetailService _companyDetailService;
        private IUnitOfWork _unitOfWork;
        private IFunctionService _functionService;

        public ProjectController(IProjectService projectService, IEmployeeProjectService employeeProjectService, ICompanyDetailService companyDetailService, IUnitOfWork unitOfWork, IFunctionService functionService)
        {
            _projectService = projectService;
            _employeeProjectService = employeeProjectService;
            _companyDetailService = companyDetailService;
            _unitOfWork = unitOfWork;
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
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.PROJECT_MANAGER);
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
        public IActionResult GetPaging(int companyId, int page = 1, int pageSize = 20, string description = "")
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.PROJECT_MANAGER);
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
                var data = _projectService.GetAllPaging(page, pageSize, companyId, description);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetById")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetById(int id,int companyId)
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.PROJECT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                var data = _projectService.GetById(id);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
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
         [Authorize(Roles = "AdminCompany")]
        public IActionResult Add([FromBody] ProjectDetailViewModel Vm)
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(Vm.CompanyId, Permission.PROJECT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                var data = _projectService.Add(Vm);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
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
        [Authorize(Roles = "AdminCompany")]
        public IActionResult Update([FromBody] ProjectDetailViewModel Vm)
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(Vm.CompanyId, Permission.PROJECT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                var result = _projectService.Update(Vm);
                if (!result)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.PROJECT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                return new OkObjectResult(new GenericResult(Vm, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
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
        [Authorize(Roles = "AdminCompany")]
        public IActionResult Delete(int companyId, int id)
        {
            try
            {
                var checkFunction = _functionService.CheckHasFunction(companyId, Permission.PROJECT_MANAGER);
                if (!checkFunction)
                {
                    return Unauthorized();
                }
                if (_employeeProjectService.GetCountEmployee(id) > 0)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.PROJECT_EXIST_EMPLOYEE, ErrorCode.ERROR_CODE));

                }
                _projectService.Delete(id);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion DELETE

        #region OTHER_METHOD
        private GenericResult CheckAccountCanLogin(AppUser user)
        {
            if (user.UserType == Roles.AdminNT)
            {
                return null;
            }
            var companyExpried = _companyDetailService.CheckCompanyExpried(user.CompanyId);
            if (user.UserType == Roles.AdminCompany)
            {
                return companyExpried;
            }
            else
            {
                if (companyExpried == null)
                {
                    if (user.Status == Status.New || user.Status == Status.Expired)
                    {
                        return new GenericResult(null, false, ErrorMsg.ACCOUNT_EXPRIED_NEW, ErrorCode.EXPIRES_EMPLOYEE_CODE);
                    }
                }
                return companyExpried;
            }
        }

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        #endregion OTHER_METHOD

    }
}