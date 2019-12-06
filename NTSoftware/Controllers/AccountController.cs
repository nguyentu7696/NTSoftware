using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface;
using NTSoftware.ViewModel.Auth;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace NTSoftware.Controllers
{
    public class AccountController : BaseController
    {
        #region CONSTRUCTOR

        private IAppUserService _appUserService;
        private readonly IConfiguration _config;
        private readonly ICompanyDetailService _companyDetailService;
        private readonly IEmailSender _emailSender;
        private IHostingEnvironment _hostingEnvironment;
        private IDetailUserService _detailUserService;
        private ILogUsedTimeService _logUsedTimeService;

        public AccountController(IAppUserService appUserService, IConfiguration config, ICompanyDetailService companyDetailService,
            IEmailSender emailSender, IHostingEnvironment hostingEnvironment, IDetailUserService detailUserService, ILogUsedTimeService logUsedTimeService)
        {
            _appUserService = appUserService;
            _config = config;
            _companyDetailService = companyDetailService;
            _emailSender = emailSender;
            _hostingEnvironment = hostingEnvironment;
            _detailUserService = detailUserService;
            _logUsedTimeService = logUsedTimeService;
        }


        #endregion CONSTRUCTOR

        #region GET

        /// <summary>
        /// Lấy lại mật khẩu
        /// </summary>
        /// <param name="email">chuỗi dạng email</param>
        /// <returns></returns>
        [HttpGet]
        [Route("RequestPassword")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestPasword(string email)
        {
            try
            {
                if (email == null || email.Trim().Length == 0)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMAIL_REQUIRED, ErrorCode.ERROR_CODE));
                }
                var regex = @"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$";
                var match = Regex.Match(email, regex, RegexOptions.IgnoreCase);
                if (!match.Success)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.EMAIL_NOT_FORMAT, ErrorCode.ERROR_CODE));
                }
                var user = _appUserService.GetByUserName(email);
                if (user == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.NOT_EXIST_EMAIL, ErrorCode.NO_EMAIL_CODE));
                }
                var checkLogin = CheckAccountCanLogin(user);
                if (checkLogin != null)
                {
                    return new OkObjectResult(checkLogin);
                }
                var code = _appUserService.GeneratePasswordResetTokenAsync(user);

                await _emailSender.SendEmailAsync(email, "", $"<div><span> Bạn vừa gửi yêu cầu lấy lại mật khẩu. Click vào đường dẫn dưới đây để tiếp tục.</span> <a href = 'http://localhost:4200/auth/reset-password?userId={user.Id}&code={code}' style = ' position: absolute; left: 50%;padding: 30px 60px; font - size: 30px;  top: 50 %; transform: translate(-50 %, -50 %);color: #1670f0; text - decoration: none; overflow: hidden;letter - spacing: 2px;text - transform: uppercase; box - shadow: 0 10px 20px rgba(0, 0, 0, 0.2);'>Reset Password</a> </div> ");

                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SEND_MAIL_SUCCESS, ErrorCode.SEND_EMAIL_SUCCESS));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }

        }

        #endregion GET

        #region POST

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginViewModel vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetByUserName(vm.UserName);
                if (user != null)
                {
                    var result = _appUserService.PasswordSignInAsync(vm.UserName, vm.Password);
                    if (!result)
                    {
                        return new OkObjectResult(new GenericResult(null, false, ErrorMsg.LOGIN_FAILED, ErrorCode.LOGIN_FAILED));
                    }
                    var checkLogin = CheckAccountCanLogin(user);
                    if (checkLogin != null)
                    {
                        return new OkObjectResult(checkLogin);
                    }
                    var token_access = SignToken(user);
                    return new OkObjectResult(new GenericResult(token_access, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
                }
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.LOGIN_FAILED, ErrorCode.HAS_ERROR_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }


        }

        [HttpPost]
        [Route("Logout")]
        [Authorize]
        public IActionResult Logout([FromBody] LogOutViewModel vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetById(vm.UserId);
                if (user == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.USER_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                if (user.UserType != Roles.AdminNT)
                {
                    _logUsedTimeService.SetLogOut(vm.UserId, vm.CompanyId);
                }
               
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.LOG_OUT_SUCCESS, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }


        }

        #endregion  POST

        #region PUT

        [HttpPut]
        [Route("ChangePasswordWithCode")]
        public IActionResult ChangePasswordWithCode([FromBody]ChangePasswordCodeViewModel vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetById(vm.userId);
                if (user == null)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.NOT_EXIST_EMAIL, ErrorCode.NO_EMAIL_CODE));
                }
                var checkLogin = CheckAccountCanLogin(user);
                if (checkLogin != null)
                {
                    return new OkObjectResult(checkLogin);
                }
                var checkCode = _appUserService.CheckTokenChangePassword(user, vm.tokenCode);
                if (!checkCode)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.INVALID_TOKEN_RESET, ErrorCode.INVALID_TOKEN_RESET));
                }
                _appUserService.ChangePassword(user, vm.newPassword);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }

        }
        [HttpPut]
        [Route("ToggleEmployee")]
        [Authorize(Roles ="AdminCompany")]
        public IActionResult ToggleEmployee([FromBody]ToggleEmployeeViewModel vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                _appUserService.ToggleUser(vm.UserId, vm.isLocked);
                _logUsedTimeService.SetLogOut(vm.UserId, vm.CompanyId);
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }

        }
        [HttpPut]
        [Route("ChangePasswordWithOldPassword")]
        [Authorize]
        public IActionResult UpdatePassword([FromBody] ChangePasswordWithOldPasswordViewModel vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var user = _appUserService.GetById(vm.userId);
                if (user == null)
                {
                    return new OkObjectResult(new GenericResult(null, false, ErrorMsg.NOT_EXIST_EMAIL, ErrorCode.NO_EMAIL_CODE));
                }

                var checkLogin = CheckAccountCanLogin(user);
                if (checkLogin != null)
                {
                    return new OkObjectResult(checkLogin);
                }
                var checkPassword = _appUserService.PasswordSignInAsync(user.UserName, vm.oldPassword);
                if (checkPassword)
                {
                    _appUserService.ChangePassword(user, vm.newPassword);
                    return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
                };

                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.OLD_PASSWORD_INCORECT, ErrorCode.ERROR_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }



        #endregion PUT

        #region OTHER_METHOD

        private string SignToken(AppUser user)
        {
            var detailUser = _detailUserService.GetById(user.Id);
            var logo = "";
            var company = _companyDetailService.GetById(user.CompanyId);
            if (company != null)
            {
                logo = company.Logo == null ? "" : company.Logo;
            }
            if(user.UserType != Roles.AdminNT)
            {
                _logUsedTimeService.SetLogIn(user.Id, user.CompanyId);
            }
            var claims = new[]
                   {
                    new Claim(JwtRegisteredClaimNames.Email, user.UserName),
                    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim("UserId",user.Id.ToString()),
                    new Claim("CompanyId",user.CompanyId.ToString()),
                    new Claim("DepartmentId",user.DepartmentId.ToString() ),
                    new Claim("UserType",user.UserType.ToString()),
                    new Claim("roles",user.UserType.ToString()),
                    new Claim("Logo",logo),
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
              expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);
            var token_access = new JwtSecurityTokenHandler().WriteToken(token);
            return token_access;
        }

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
                if (user.Status == Status.New || user.Status == Status.Expired)
                {
                    return new GenericResult(null, false, ErrorMsg.ACCOUNT_EXPRIED_NEW, ErrorCode.EXPIRES_EMPLOYEE_CODE);
                }
                else if (user.isLocked)
                {
                    return new GenericResult(null, false, ErrorMsg.LOCK_ACCOUNT, ErrorCode.ERROR_CODE);
                }
                else
                {
                    return companyExpried;
                }

            }
        }
        #endregion OTHER_METHOD
    }
}
