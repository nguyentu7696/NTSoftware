using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Repository;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using NTSoftware.ViewModel.Auth;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : BaseController
    {
        #region CONTRUCTOR

        private ICompanyDetailService _companyDetailService;
        private IMapper _mapper;
        private IUnitOfWork _unitOfWork;
        private IAppUserService _appUserService;
        private IRuleService _ruleService;
        private ILogUsedTimeService _logUsedTimeService;
        private AppDbContext _appDbContext;
        private IContractCompanyService _contractCompanyService;
        private IEmployeeContractService _employeeContractService;
        private IDetailUserService _detailUserService;
        private IFunctionService _functionService;
        public CompanyController(ICompanyDetailService companyDetailService, IMapper mapper, IUnitOfWork unitOfWork, IAppUserService appUserService, IRuleService ruleService, AppDbContext appDbContext, IContractCompanyService contractCompanyService,
            IEmployeeContractService employeeContractService, IDetailUserService detailUserService, IFunctionService functionService, ILogUsedTimeService logUsedTimeService)
        {
            _companyDetailService = companyDetailService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _appUserService = appUserService;
            _ruleService = ruleService;
            _appDbContext = appDbContext;
            _contractCompanyService = contractCompanyService;
            _employeeContractService = employeeContractService;
            _detailUserService = detailUserService;
            _functionService = functionService;
            _logUsedTimeService = logUsedTimeService;
        }
        #endregion CONTRUCTOR

        #region GET

        [HttpGet]
        [Route("GetById")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetById(int id)
        {
            try
            {
                var result = _companyDetailService.GetById(id);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetLogUse")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetLogUse(int companyId, int month, int year, bool isPayed, int pageIndex = 1, int pageSize = 20)
        {
            try
            {
                if (pageIndex < 1)
                {
                    pageIndex = 1;
                }
                if (pageIndex < 0)
                {
                    pageSize = 20;
                }
                var result = _logUsedTimeService.GetPagingByCompany(companyId, month, year, pageIndex, pageSize, isPayed);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetPaging")]
        //[Authorize(Roles = "AdminNT")]
        public IActionResult GetPaging(string nameCompany = "",
            string phoneNumber = "", string address = "",
            string representativeName = "", string positionRepresentative = "", int pageIndex = 1, int pageSize = 20)
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
                var result = _companyDetailService.GetAllPaging(pageIndex, pageSize, nameCompany, phoneNumber, address, representativeName, positionRepresentative);
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
        [Route("Pay")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult AddCompany([FromBody] PayViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var contract = _contractCompanyService.GetCurrentContract(Vm.CompanyId);
                if (contract != null && contract.Status == Status.Active)
                {
                    var now = DateTime.Now;
                    if ((now.Year == Vm.Year && now.Month < Vm.Month) || (now.Year < Vm.Year))
                    {
                        return new OkObjectResult(new GenericResult(null, false, ErrorMsg.NOT_TO_PAY, ErrorCode.ERROR_CODE));

                    }
                }
                else if (contract != null && contract.Status == Status.New)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.NOT_PAY_NEW, ErrorCode.ERROR_CODE));
                }

                _logUsedTimeService.PayByMonth(Vm.Month, Vm.Year, Vm.CompanyId);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpPost]
        [Route("AddCompany")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult AddCompany([FromBody] CompanyFullViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetByUserName(Vm.EmployeeVm.UserName);
                if (user != null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_EXISTED, ErrorCode.ERROR_CODE));
                }
                var checkCompanyEmail = _companyDetailService.CheckEmailCompany(Vm.Email);
                if (!checkCompanyEmail)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMAIL_USED, ErrorCode.ERROR_CODE));
                }
                var company = _companyDetailService.Add(_mapper.Map<CompanyDetailViewModel>(Vm));
                SaveChanges();
                Vm.CompanyCode = company.CompanyCode;
                Vm.ContractVm.CompanyId = company.Id;
                var contractCompany = _contractCompanyService.Add(_mapper.Map<ContractCompanyViewModel>(Vm.ContractVm), company.CompanyCode);
                Vm.EmployeeVm.UserType = Roles.AdminCompany;
                Vm.EmployeeVm.CompanyId = company.Id;

                var userVm = _mapper.Map<EmployeeViewModel, AppUserViewModel>(Vm.EmployeeVm);
                userVm.UserType = Roles.AdminCompany;
                userVm.ContractNumber = contractCompany.ContractNumber;
                var result = _appUserService.Add(userVm);
                if (result != null)
                {
                    var detailVm = _mapper.Map<EmployeeViewModel, DetailUserViewModel>(Vm.EmployeeVm);
                    detailVm.Id = result.Id;
                    var resultDetail = _detailUserService.Add(detailVm, company.CompanyCode, company.Id);
                    _functionService.AddByOption(Vm.OptionId, contractCompany.Id);
                    SaveChanges();
                    return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
                }
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpPost]
        [Route("AddEmployee")]
       // [Authorize(Roles = "AdminCompany")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeFullViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetByUserName(Vm.EmployeeViewModel.UserName);
                if (user != null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_EXISTED, ErrorCode.ERROR_CODE));
                }
                var company = _companyDetailService.GetById(Vm.CompanyId);
                if (company == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.COMPANY_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                var checkContract = _contractCompanyService.CheckMaxEmployee(company.Id);
                if (!checkContract)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.CAN_NOT_ADD_EMPLOYEE, ErrorCode.ERROR_CODE));
                }
                var contrucEmployee = _employeeContractService.Add(_mapper.Map<EmployeeContractViewModel>(Vm), company.CompanyCode);
                var userVm = _mapper.Map<EmployeeViewModel, AppUserViewModel>(Vm.EmployeeViewModel);
                userVm.UserType = Roles.Employee;
                userVm.Status = Status.New;
                userVm.ContractNumber = contrucEmployee.ContractNumber;
                userVm.CompanyId = company.Id;

                var result = _appUserService.Add(userVm);

                if (result != null)
                {
                    contrucEmployee.EmployeeId = result.Id;
                    var detailVm = _mapper.Map<EmployeeViewModel, DetailUserViewModel>(Vm.EmployeeViewModel);
                    detailVm.Id = result.Id;
                    var resultDetail = _detailUserService.Add(detailVm, company.CompanyCode, company.Id);
                    SaveChanges();
                    return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
                }
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.HAS_ERROR, ErrorCode.HAS_ERROR_CODE));
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
        public IActionResult Update([FromBody] CompanyDetailViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }

                var result = _companyDetailService.Update(Vm);
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
        public IActionResult Delete(int companyId)
        {
            try
            {
                var bIsExist = _companyDetailService.CheckCompanyExist(companyId);
                if (bIsExist)
                {
                    var checkCanDelete = _contractCompanyService.CheckCanDelete(companyId);
                    if (!checkCanDelete)
                    {
                        return new OkObjectResult(new GenericResult(null, false, ErrorMsg.COMPANY_HAS_CONTRACT, ErrorCode.ERROR_CODE));
                    }
                    _companyDetailService.DeleteCompany(companyId);
                    SaveChanges();
                    return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));

                }
                else
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.COMPANY_NOT_EXITS, ErrorCode.ERROR_CODE));
                }


            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion DELETE

        #region PRIVATE_METHOD

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        #endregion PRIVATE_METHOD
    }
}