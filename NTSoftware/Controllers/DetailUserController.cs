using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using NTSoftware.ViewModel.Auth;

namespace NTSoftware.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetailUserController : ControllerBase
    {
        #region CONTRUCTOR

        private IDetailUserService _detailUserService;
        private ICompanyDetailService _companyDetailService;
        private IUnitOfWork _unitOfWork;
        private IAppUserService _appUserService;
        private readonly IConfiguration _config;

        public DetailUserController(IDetailUserService detailUserService, ICompanyDetailService companyDetailService,
            IUnitOfWork unitOfWork, IAppUserService appUserService, IConfiguration config)
        {
            _detailUserService = detailUserService;
            _companyDetailService = companyDetailService;
            _unitOfWork = unitOfWork;
            _appUserService = appUserService;
            _config = config;
        }

        #endregion CONTRUCTOR

        #region GET
        [HttpGet]
        [Route("SelectDepartment")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetSelectDepartment(int companyId, string lstVm, string keyword = "", int departmentId = 0)
        {
            try
            {
                //var checkCompanyExpired = _companyDetailService.CheckCompanyExpried(comanyId);
                //if (checkCompanyExpired != null)
                //{
                //    return new BadRequestObjectResult(checkCompanyExpired);
                //}
                if (lstVm == null)
                {
                    lstVm = "";
                }
                var data = _detailUserService.GetUserWithoutDepartment(lstVm.Split(';').ToList(), companyId, keyword, departmentId);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetAll")]
       // [Authorize(Roles = "AdminCompany")]
        public IActionResult GetAll(int companyId)
        {
            try
            {
                var data = _detailUserService.GetAll(companyId);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("SelectProject")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetSelectProject(int companyId, string lstVm, string keyword = "")
        {
            try
            {
                //var checkCompanyExpired = _companyDetailService.CheckCompanyExpried(comanyId);
                //if (checkCompanyExpired != null)
                //{
                //    return new BadRequestObjectResult(checkCompanyExpired);
                //}
                if (lstVm == null)
                {
                    lstVm = "";
                }
                var data = _detailUserService.GetSelectProject(lstVm.Split(';').ToList(), companyId, keyword);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetByUser")]
        [Authorize(Roles = "AdminCompany,AdminNT,Employee")]
        public async Task<IActionResult> GetByUserAsync(int id)
        {
            try
            {
                var user = _appUserService.GetById(id);
                if (user == null)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                var detail = _detailUserService.GetById(user.Id);
                return new OkObjectResult(new GenericResult(detail, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpGet]
        [Route("GetPagingByCompany")]
        [Authorize(Roles = "AdminCompany,AdminNT")]
        public IActionResult GetPagingByCompany(int companyId, string name = "", string contractNumber = "", int page = 1, int pageSize = 20)
        {
            try
            {
                if (page < 0)
                {
                    page = 1;
                }
                if (pageSize < 0)
                {
                    pageSize = 20;
                }
                var detail = _detailUserService.GetPaging(page, companyId, pageSize, name, contractNumber);
                return new OkObjectResult(new GenericResult(detail, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        [HttpGet]
        [Route("GetAllByProject")]
        [Authorize(Roles = "AdminCompany")]
        public IActionResult GetPagingByProject(int projectId)
        {
            try
            {
                var detail = _detailUserService.GetUserInProject(projectId);
                return new OkObjectResult(new GenericResult(detail, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion GET

        #region POST

        #endregion POST

        #region PUT

        [HttpPut]
        [Route("UpdateAdmin")]
        [Authorize(Roles = "AdminNT")]
        public async Task<IActionResult> UpdateAdmin([FromBody] UserAdminViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetById(Vm.UserId);
                if (user == null)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                var checkAccount = CheckAccountCanLogin(user);
                if (checkAccount != null)
                {
                    return new OkObjectResult(checkAccount);
                }
                _detailUserService.UpdateAdmin(Vm);
                SaveChanges();
                user = _appUserService.GetById(Vm.UserId);
                var token = SignToken(user);
                return new OkObjectResult(new GenericResult(token, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
        [HttpPut]
        [Route("UpdateEmployee")]
        [Authorize(Roles = "AdminCompany,Employee")]
        public async Task<IActionResult> UpdateEmployeeAsync([FromBody] DetailUserViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                if (Vm.Id == null)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetById(Vm.Id);
                if (user == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                _detailUserService.Update(Vm);
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
        [Route("DeleteEmployee")]
        [Authorize(Roles = "AdminCompany")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {

                if (id == null)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _detailUserService.GetById(id);
                if (user == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ACCOUNT_NOT_EXITS, ErrorCode.ERROR_CODE));
                }
                var checkDelete = _detailUserService.CheckCanDelete(id);
                if (!checkDelete)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMPLOYEE_HAS_CONTRACT, ErrorCode.ERROR_CODE));
                }
                _detailUserService.Delete(id);
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
        private string SignToken(AppUser user)
        {
            var detailUser = _detailUserService.GetById(user.Id);
            var claims = new[]
                   {
                    new Claim(JwtRegisteredClaimNames.Email, user.UserName),
                    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim("UserId",user.Id.ToString()),
                    new Claim("CompanyId",user.CompanyId.ToString()),
                    new Claim("UserType",user.UserType.ToString()),
                    new Claim("roles",user.UserType.ToString()),
                    new Claim("PhoneNumber",detailUser.PhoneNumber ==null?"":detailUser.PhoneNumber.ToString()),
                    new Claim("Address",detailUser.Address.ToString()),
                    new Claim("Birthday",detailUser.Birthday.ToString()),
                    new Claim("Gender",detailUser.Gender.ToString()),
                    new Claim("Position",user.Position ==null?"":user.Position.ToString()),
                    new Claim("Name",detailUser.Name.ToString()),
                    new Claim("Email",user.UserName.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Tokens:Issuer"],
                _config["Tokens:Issuer"],
                claims,
              expires: DateTime.UtcNow.AddHours(12),
                signingCredentials: creds);
            var token_access = new JwtSecurityTokenHandler().WriteToken(token);
            return token_access;
        }
        #endregion OTHER_METHOD

    }
}