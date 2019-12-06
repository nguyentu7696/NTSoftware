using AutoMapper;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
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

namespace NTSoftware.Service
{
    public class EmployeeContractService : IEmployeeContractService
    {
        #region CONTRUCTOR

        private readonly IMapper _mapper;
        private AppDbContext _appDbContext;
        private IUnitOfWork _unitOfWork;
        private IUserRepository _userRepository;
        private IEmployeeContractRepository _employeeContractRepository;

        public EmployeeContractService(IMapper mapper, IEmployeeContractRepository employeeContractRepository, AppDbContext appDbContext, IUnitOfWork unitOfWork, IUserRepository userRepository)
        {
            _mapper = mapper;
            _employeeContractRepository = employeeContractRepository;
            _appDbContext = appDbContext;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
        }

        #endregion CONTRUCTOR

        #region GET

        public EmployeeContractViewModel GetById(int id)
        {
            var data = _employeeContractRepository.FindById(id);
            return _mapper.Map<EmployeeContract, EmployeeContractViewModel>(data);
        }

        public PagedResult<EmployeeContractViewModel> GetAllPaging(int page, int pageSize, string employeeId)
        {
            var query = _employeeContractRepository.FindAll(x => x.EmployeeId.ToString()==employeeId);

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize).Take(pageSize).OrderBy(x=>x.Status);
            try
            {
                var data = _mapper.Map<List<EmployeeContract>, List<EmployeeContractViewModel>>(query.ToList());

                var paginationSet = new PagedResult<EmployeeContractViewModel>()
                {
                    Results = data,
                    CurrentPage = page,
                    RowCount = totalRow,
                    PageSize = pageSize
                };
                return paginationSet;
            }
            catch
            {
                return new PagedResult<EmployeeContractViewModel>()
                {
                    Results = new List<EmployeeContractViewModel>(),
                    CurrentPage = page,
                    RowCount = 0,
                    PageSize = pageSize
                }; ;
            }
        }

        #endregion GET

        #region POST

        public EmployeeContract Add(EmployeeContractViewModel vm, string companyCode)
        {
            vm.Status = Status.New;
            var entity = _mapper.Map<EmployeeContract>(vm);
            entity.ContractNumber = $"HDE{companyCode}{_employeeContractRepository.FindAll().ToList().Count + 1}";
            _employeeContractRepository.Add(entity);
            return entity;
        }

        #endregion POST

        #region PUT

        public bool UpdateStatusEmployee(StatusContractEmployee vm)
        {
            var entity = _employeeContractRepository.FindSingle(x => x.EmployeeId.ToString() == vm.employeeId && x.Id == vm.contractId);
            if(entity == null)
            {
                return false;
            }
            entity.Status = vm.status;
            if(entity.Status == Status.Active)
            {
                var lstContract = _employeeContractRepository.FindAll(x => x.EmployeeId.ToString() == vm.employeeId && x.Status ==Status.Active);
                foreach (var item in lstContract)
                {
                    if (item.Id != vm.contractId)
                    {
                        item.Status = Status.Expired;
                    }
                }
                _employeeContractRepository.UpdateRange(lstContract);
                var user = _userRepository.FindAll().Where(x => x.Id.ToString() == vm.employeeId).SingleOrDefault();
                if (user != null)
                {
                    user.ContractNumber = entity.ContractNumber;
                    user.Status = Status.Active;
                    _userRepository.Update(user);
                }
                
            }
            if(entity.Status == Status.Expired)
            {
                var lstContract = _employeeContractRepository.FindAll(x => x.EmployeeId.ToString() == vm.employeeId && x.Id == vm.contractId && x.Status==Status.New);
                if(lstContract ==null || lstContract.Count() == 0)
                {
                    var user = _userRepository.FindAll().Where(x => x.Id.ToString() == vm.employeeId).SingleOrDefault();
                    if (user != null)
                    {
                        user.ContractNumber = entity.ContractNumber;
                        user.Status = Status.Expired;
                        _userRepository.Update(user);
                    }
                }
            }
            return true;
        }
        public void SaveChange()
        {
            _unitOfWork.Commit();
        }
        #endregion PUT

        #region DELETE

        public void Delete(int id)
        {
            var entity = _employeeContractRepository.FindById(id);
            _employeeContractRepository.RemoveFlg(entity);
            _employeeContractRepository.Update(entity);
        }

        #endregion DELETE

        #region OTHER_METHOD

        #endregion OTHER_METHOD




    }
}
