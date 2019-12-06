
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Helper;
using NTSoftware.Repository.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NTSoftware.Repository.Repository
{
    public class DetailUserRepository : NTRepository<DetailUser, int>, IDetailUserRepository
    {
        private AppDbContext _appContext;
        public DetailUserRepository(AppDbContext appContext) : base(appContext)
        {
            _appContext = appContext;
        }

        public List<SelectUserViewModel> GetAll(int companyId)
        {
            try
            {
                var users = _appContext.Set<AppUser>().Where(x => x.CompanyId == companyId
                && x.DeleteFlag != StatusDelete.DELETED

               && x.UserType == Roles.Employee && x.Status == Status.Active );
                var detailUser = _context.Set<DetailUser>().Where(x => x.DeleteFlag != StatusDelete.DELETED );
                var lstUser = (from u in users
                               join d in detailUser on u.Id equals d.Id
                               select new SelectUserViewModel
                               {
                                   Id = u.Id,
                                   Address = d.Address,
                                   Birthday = d.Birthday,
                                   EmployeeKey = d.EmployeeKey,
                                   Gender = d.Gender,
                                   IdentityCard = d.IdentityCard,
                                   Name = d.Name,
                                   PhoneNumber = d.PhoneNumber,
                                   CompanyId = u.CompanyId,
                                   DepartmentId = u.DepartmentId,
                                   Position = u.Position,
                                   ContractNumber = u.ContractNumber
                               }).ToList();
                return lstUser;

            }
            catch (Exception ex)
            {
                return new List<SelectUserViewModel>();
            }
        }

        public List<SelectUserViewModel> GetLstEmployee(int companyId, string keyword, string contractNumber)
        {
            try
            {
                var users = _appContext.Set<AppUser>().Where(x => x.CompanyId == companyId && x.DeleteFlag != StatusDelete.DELETED
                && x.UserType == Roles.Employee && Utilities.ConvertToUnSign(x.ContractNumber).Contains(Utilities.ConvertToUnSign(contractNumber)));
                var detailUser = _context.Set<DetailUser>().Where(x => x.DeleteFlag != StatusDelete.DELETED
                && Utilities.ConvertToUnSign(x.Name).Contains(Utilities.ConvertToUnSign(keyword)));
                var lstUser = (from u in users
                               join d in detailUser on u.Id equals d.Id
                               select new SelectUserViewModel
                               {
                                   Id = u.Id,
                                   Address = d.Address,
                                   Birthday = d.Birthday,
                                   EmployeeKey = d.EmployeeKey,
                                   Gender = d.Gender,
                                   IdentityCard = d.IdentityCard,
                                   Name = d.Name,
                                   PhoneNumber = d.PhoneNumber,
                                   CompanyId = u.CompanyId,
                                   DepartmentId = u.DepartmentId,
                                   Position = u.Position,
                                   ContractNumber = u.ContractNumber,
                                   isLocked = u.isLocked
                               }).ToList();
                return lstUser;

            }
            catch (Exception ex)
            {
                return new List<SelectUserViewModel>();
            }

        }

        public List<SelectUserViewModel> GetSelectProject(List<string> lstSelected, int companyId, string keyword)
        {
            try
            {
                var users = _appContext.Set<AppUser>().Where(x => x.CompanyId == companyId
                && x.DeleteFlag != StatusDelete.DELETED
                && !lstSelected.Contains(x.Id.ToString())
               && x.UserType == Roles.Employee && x.Status == Status.Active);
                var detailUser = _context.Set<DetailUser>().Where(x => x.DeleteFlag != StatusDelete.DELETED
                && Utilities.ConvertToUnSign(x.Name).Contains(Utilities.ConvertToUnSign(keyword)));
                var lstUser = (from u in users
                               join d in detailUser on u.Id equals d.Id
                               select new SelectUserViewModel
                               {
                                   Id = u.Id,
                                   Address = d.Address,
                                   Birthday = d.Birthday,
                                   EmployeeKey = d.EmployeeKey,
                                   Gender = d.Gender,
                                   IdentityCard = d.IdentityCard,
                                   Name = d.Name,
                                   PhoneNumber = d.PhoneNumber,
                                   CompanyId = u.CompanyId,
                                   DepartmentId = u.DepartmentId,
                                   Position = u.Position,
                                   ContractNumber = u.ContractNumber
                               }).ToList();
                return lstUser;

            }
            catch (Exception ex)
            {
                return new List<SelectUserViewModel>();
            }
        }

        public List<SelectUserViewModel> GetUserWithoutDepartment(List<string> lstSelected, int companyId, string keyword,int departmentId)
        {
            try
            {
                var users = _appContext.Set<AppUser>().Where(x => x.CompanyId == companyId
                && x.DeleteFlag != StatusDelete.DELETED
                && !lstSelected.Contains(x.Id.ToString())
               && x.UserType == Roles.Employee && x.Status == Status.Active && (x.DepartmentId == 0 || x.DepartmentId == departmentId));
                var detailUser = _context.Set<DetailUser>().Where(x => x.DeleteFlag != StatusDelete.DELETED
                && Utilities.ConvertToUnSign(x.Name).Contains(Utilities.ConvertToUnSign(keyword)));
                var lstUser = (from u in users
                               join d in detailUser on u.Id equals d.Id
                               select new SelectUserViewModel
                               {
                                   Id = u.Id,
                                   Address = d.Address,
                                   Birthday = d.Birthday,
                                   EmployeeKey = d.EmployeeKey,
                                   Gender = d.Gender,
                                   IdentityCard = d.IdentityCard,
                                   Name = d.Name,
                                   PhoneNumber = d.PhoneNumber,
                                   CompanyId = u.CompanyId,
                                   DepartmentId = u.DepartmentId,
                                   Position = u.Position,
                                   ContractNumber = u.ContractNumber
                               }).ToList();
                return lstUser;

            }
            catch (Exception ex)
            {
                return new List<SelectUserViewModel>();
            }
        }
    }
}
