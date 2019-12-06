using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Core.Shared.Helper;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Repository;
using NTSoftware.Repository.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace NTSoftware.Service
{
    public class DetailUserService : IDetailUserService
    {
        #region CONTRUCTOR

        private readonly IMapper _mapper;
        private IDetailUserRepository _detailUserRepository;
        private IUserRepository _userRepository;
        private IEmployeeContractRepository _employeeContractRepository;
        private IEmployeeProjectRepository _employeeProjectRepository;

        public DetailUserService(IMapper mapper, IDetailUserRepository detailUserRepository, IUserRepository userRepository, IEmployeeProjectRepository employeeProjectRepository, IEmployeeContractRepository employeeContractRepository)
        {
            _mapper = mapper;
            _detailUserRepository = detailUserRepository;
            _userRepository = userRepository;
            _employeeProjectRepository = employeeProjectRepository;
            _employeeContractRepository = employeeContractRepository;
        }

        #endregion CONTRUCTOR

        #region GET

        public DetailUserViewModel GetById(int id)
        {
            var model = _detailUserRepository.FindById(id);
            var data = _mapper.Map<DetailUser, DetailUserViewModel>(model);
            data.Email = _userRepository.FindById(id).UserName;
            return data;
        }

        public PagedResult<SelectUserViewModel> GetPaging(int page, int companyId, int pageSize, string name, string contractNumber)
        {
            var query = _detailUserRepository.GetLstEmployee(companyId, name, contractNumber);
            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var paginationSet = new PagedResult<SelectUserViewModel>()
            {
                Results = query,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;
        }
        public List<SelectUserViewModel> GetUserWithoutDepartment(List<string> lstVm, int companyId, string keyword, int departmentId)
        {
            var data = _detailUserRepository.GetUserWithoutDepartment(lstVm, companyId, keyword, departmentId);
            return data;
        }
        public List<DetailUserViewModel> GetUserInProject(int projectId)
        {
            var lstUser = _detailUserRepository.FindAll();
            var project = _employeeProjectRepository.FindAll();
            var query = (from u in lstUser
                         join p in project on u.Id
                            equals p.UserID
                            where p.ProjectId == projectId
                         select new DetailUserViewModel { Id = u.Id, Address = u.Address, Birthday = u.Birthday, Gender = u.Gender, EmployeeKey = u.EmployeeKey, Name = u.Name, IdentityCard = u.IdentityCard, PhoneNumber = u.PhoneNumber }).ToList();
                       
            return query;
        }
        public List<SelectUserViewModel> GetSelectProject(List<string> lstVm, int companyId, string keyword)
        {
            var data = _detailUserRepository.GetSelectProject(lstVm, companyId, keyword);
            return data;
        }
        public List<SelectUserViewModel> GetAll(int companyId)
        {
            var data = _detailUserRepository.GetAll(companyId);
            return data;
        }

        #endregion GET

        #region POST

        public DetailUser Add(DetailUserViewModel Vm, string companyCode, int companyId)
        {
            var entity = _mapper.Map<DetailUser>(Vm);
            var lstUser = _userRepository.FindAll().Where(x => x.CompanyId == companyId).ToList();
            entity.EmployeeKey = $"NV{companyCode}{lstUser.Count + 1}";
            _detailUserRepository.Add(entity);
            return entity;
        }

        #endregion POST

        #region PUT

        public void Update(DetailUserViewModel Vm)
        {
            var entity = _detailUserRepository.FindById(Vm.Id);
            entity = _mapper.Map(Vm, entity);
            _detailUserRepository.Update(entity);
        }
        public void UpdateAdmin(UserAdminViewModel vm)
        {
            var entity = _detailUserRepository.FindById(vm.UserId);
            entity = _mapper.Map(vm, entity);
            _detailUserRepository.Update(entity);
            var user = _userRepository.FindAll().Where(x => x.Id == vm.UserId).SingleOrDefault();
            user.Position = vm.Position;
            _userRepository.Update(user);
        }
        #endregion PUT

        #region DELETE

        public void Delete(int id)
        {
            var entity = _detailUserRepository.FindById(id);
            entity.DeleteFlag = StatusDelete.DELETED;
            _detailUserRepository.Update(entity);
        }

        public bool CheckCanDelete(int id)
        {
            var contract = _employeeContractRepository.FindSingle(x => x.Status != Status.New && x.EmployeeId == id);
            return contract == null;
        }
        #endregion DELETE

        #region OTHER_METHOD

        #endregion OTHER_METHOD
    }
}
