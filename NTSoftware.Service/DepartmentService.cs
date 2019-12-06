using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
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
using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Service
{
    public class DepartmentService : IDepartmentService
    {

        #region CONTRUCTOR

        private IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private IUserRepository _userRepository;
        private IDetailUserRepository _detailUserRepository;
        private IDepartmentRepository _idepartmentRepository;
        private readonly AppDbContext _dbContext;

        public DepartmentService(IUnitOfWork unitOfWork, IMapper mapper, IUserRepository userRepository,
            IDetailUserRepository detailUserRepository, IDepartmentRepository idepartmentRepository, AppDbContext dbContext)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _userRepository = userRepository;
            _detailUserRepository = detailUserRepository;
            _idepartmentRepository = idepartmentRepository;
            _dbContext = dbContext;
        }

        #endregion CONTRUCTOR

        #region GET

        public DetailDepartmentViewModel GetById(int id, int companyId)
        {
            var department = _idepartmentRepository.FindById(id);
            if (department == null)
            {
                return null;
            }
            var lstEmployee = _userRepository.FindAll().Where(x => x.DepartmentId == id && x.CompanyId == companyId).Select(x => x.Id).ToList();
            var data = _mapper.Map<Department, DetailDepartmentViewModel>(department);
            data.lstEmployee = lstEmployee;
            return data;
        }

        public PagedResult<DepartmentViewModel> GetAllPaging(int page, int pageSize, int companyId)
        {
            try
            {
                var department = _idepartmentRepository.FindAll(x => x.CompanyId == companyId);
                var employee = _userRepository.FindAll().Where(x => x.CompanyId == companyId && x.DeleteFlag == StatusDelete.NON_DELETED).ToList();

                var detailUser = _detailUserRepository.FindAll();
                var query = (from d in department

                             select new DepartmentViewModel()
                             {
                                 Id = d.Id,
                                 Address = d.Address,
                                 CompanyId = d.CompanyId,
                                 DepartmentName = d.DepartmentName,
                                 Description = d.Description,
                                 Email = d.Email,
                                 ManagerName = detailUser.SingleOrDefault(x => x.Id == d.ManagerId).Name,
                                 PhoneNumber = d.PhoneNumber,
                                 ManagerId = d.ManagerId,
                                 EmployeeCount = employee.Count(x => x.DepartmentId == d.Id)
                             });
                int totalRow = query.Count();
                query = query.OrderBy(x => x.DepartmentName).Skip((page - 1) * pageSize).Take(pageSize);
                var paginationSet = new PagedResult<DepartmentViewModel>()
                {
                    Results = query.ToList(),
                    CurrentPage = page,
                    RowCount = totalRow,
                    PageSize = pageSize
                };
                return paginationSet;
            }
            catch
            {
                return new PagedResult<DepartmentViewModel>()
                {
                    Results = new List<DepartmentViewModel>(),
                    CurrentPage = page,
                    RowCount = 0,
                    PageSize = pageSize
                };
            }
        }

        #endregion GET

        #region POST

        public Department Add(DetailDepartmentViewModel vm)
        {

            var entity = _mapper.Map<Department>(vm);
            _idepartmentRepository.Add(entity);
            SaveChanges();
            foreach (var item in vm.lstEmployee)
            {
                var user = _userRepository.FindAll().Where(x => x.Id == item).SingleOrDefault();
                if (user.DepartmentId == 0 && user.CompanyId == entity.CompanyId)
                {
                    user.DepartmentId = entity.Id;
                    _userRepository.Update(user);
                }
            }
            SaveChanges();
            return entity;
        }

        #endregion POST

        #region PUT

        public bool Update(DetailDepartmentViewModel vm)
        {
            var entity = _idepartmentRepository.FindById(vm.Id);
            if (entity == null)
            {
                return false;
            }
            _mapper.Map(vm, entity);
            var lstOldUser = _userRepository.FindAll().Where(x => x.DepartmentId == vm.Id).ToList();
            if (lstOldUser != null && lstOldUser.Count > 0)
            {
                foreach (var item in lstOldUser)
                {
                    item.DepartmentId = 0;
                    _userRepository.Update(item);
                }
            }
            foreach (var item in vm.lstEmployee)
            {
                var user = _userRepository.FindAll().Where(x => x.Id == item).SingleOrDefault();
                if (user != null && user.DepartmentId == 0 && user.CompanyId == entity.CompanyId)
                {
                    user.DepartmentId = entity.Id;
                    _userRepository.Update(user);
                }
            }
            _idepartmentRepository.Update(entity);
            SaveChanges();
            return true;
        }

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        #endregion PUT

        #region DELETE

        public void Delete(int id)
        {
            var entity = _idepartmentRepository.FindById(id);
            entity.DeleteFlag = StatusDelete.DELETED;
            _idepartmentRepository.Update(entity);
            SaveChanges();
        }

        public int GetEmployeeCount(int companyId)
        {
            return _idepartmentRepository.FindAll(x => x.CompanyId == companyId).Count();
        }

        #endregion DELETE
    }

}

