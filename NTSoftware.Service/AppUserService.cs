
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Repository;
using NTSoftware.Repository.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace NTSoftware.Service
{
    public class AppUserService : IAppUserService
    {
        #region CONTRUCTOR

        private readonly IMapper _mapper;
        private IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;

        public AppUserService(IMapper mapper, IUnitOfWork unitOfWork, IUserRepository userRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
        }

        #endregion CONTRUCTOR

        #region GET

        public AppUser GetById(int id)
        {
            var user = _userRepository.FindById(id);
            return user;
        }
        public AppUser GetByUserName(string userName)
        {
            var user = _userRepository.GetByUserName(userName);
            return user;
        }
        public PagedResult<AppUserViewModel> GetAllPaging(int page, int pageSize)
        {

            var query = _userRepository.FindAll();
            int totalRow = query.Count();
            query = query.OrderBy(x => x.UserName)
               .Skip((page - 1) * pageSize).Take(pageSize);
            var data = query.ProjectTo<AppUserViewModel>().ToList();
            var paginationSet = new PagedResult<AppUserViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;

        }

        #endregion GET 

        #region POST

        public AppUser Add(AppUserViewModel userVm)
        {
            var user = _mapper.Map<AppUserViewModel, AppUser>(userVm);
            var entity = _userRepository.CreateAsync(user, userVm.Password);
            SaveChanges();
            return entity;
        }

        #endregion POST

        #region PUT

        public void UpdateAsync(AppUserViewModel Vm)
        {
            var user = _mapper.Map<AppUser>(Vm);
            _userRepository.Update(user);
            SaveChanges();
        }
        public void ChangePassword(AppUser user, string password)
        {
            user.Password = PasswordHash.HashPassword(password);
            user.TokenReset = null;
            _userRepository.Update(user);
            SaveChanges();
        }
        #endregion PUT

        #region DELETE

        public void DeleteUser(int id)
        {
            var user = _userRepository.FindById(id);
            _userRepository.RemoveFlg(user);
            _userRepository.Update(user);
        }

        #endregion DELETE

        #region OTHER_METHOD
        public bool CheckListUserInCompanyAsync(List<int> userIdLst, int companyId)
        {
            foreach (var item in userIdLst)
            {
                var user =  _userRepository.FindById(item);
                if (user == null || user.CompanyId != companyId)
                {
                    return false;
                }
            }
            return true;
        }
        public GenericResult CheckUserExits(AppUserViewModel vm)
        {
            var user = _userRepository.GetByUserName(vm.UserName);
            if (user == null)
            {
                return new GenericResult(null, false, ErrorMsg.NOT_EXIST_EMAIL, ErrorCode.ERROR_CODE);
            }
            return null;
        }

        public void RemoveDepartment(int departmentId)
        {
            var lstUser = _userRepository.FindAll().Where(x => x.DepartmentId == departmentId).ToList();
            foreach (var item in lstUser)
            {
                var user = _mapper.Map<AppUser>(item);
                user.DepartmentId = 0;
                _userRepository.Update(user);
            }
            SaveChanges();
        }

        public void AddDepartment(List<int> lstVm, int departmentId)
        {
            var lstUser = _userRepository.FindAll().Where(x => lstVm.Contains(x.Id)).ToList();
            foreach (var item in lstUser)
            {
                item.DepartmentId = departmentId;
                _userRepository.Update(item);
            }
            SaveChanges();
        }
        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public bool PasswordSignInAsync(string userName, string password)
        {
            var user = _userRepository.FindSingle(x => x.UserName == userName);
            if(user == null)
            {
                return false;
            }
            var verify = PasswordHash.ValidatePassword(password, user.Password);
            return verify;
        }

        public string GeneratePasswordResetTokenAsync(AppUser user)
        {
            var code = _userRepository.CreateTokenChangePassword(user);
            user.TokenReset = code;
            _userRepository.Update(user);
            SaveChanges();
            return code;
        }

        public bool CheckTokenChangePassword(AppUser user, string token)
        {
            return _userRepository.CheckTokenChangePassword(user, token);
        }

        public void ToggleUser(int userId,bool isLocked)
        {
            var user = _userRepository.FindById(userId);
            user.isLocked = isLocked;
            _userRepository.Update(user);
            SaveChanges();
        }

        #endregion OTHER_METHOD
    }
}
