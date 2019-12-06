using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Enum;
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
using System.Threading.Tasks;

namespace NTSoftware.Service
{
    public class ContractCompanyService : IContractCompanyService
    {
        #region CONTRUCTOR

        private readonly IMapper _mapper;
        private IContractCompanyRepository _contractCompanyRepository;
        private ICompanyRepository _companyRepository;
        private IUserRepository _userRepository;
        private IUnitOfWork _unitOfWork;
        private readonly AppDbContext _dbContext;

        public ContractCompanyService(IMapper mapper, IContractCompanyRepository contractCompanyRepository,
            ICompanyRepository companyRepository, IUserRepository userRepository, IUnitOfWork unitOfWork, AppDbContext dbContext)
        {
            _mapper = mapper;
            _contractCompanyRepository = contractCompanyRepository;
            _companyRepository = companyRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
            _dbContext = dbContext;
        }
        #endregion CONTRUCTOR

        #region GET

        public PagedResult<ContractCompanyViewModel> GetAllPaging(int page, int companyId, int pageSize)
        {

            var query = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId);
            int totalRow = query.Count();
            query = query.OrderBy(x => x.Status).Skip((page - 1) * pageSize).Take(pageSize);
            var data = _mapper.Map<List<ContractCompany>, List<ContractCompanyViewModel>>(query.ToList());

            var paginationSet = new PagedResult<ContractCompanyViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;

        }
        public ContractCompanyViewModel GetById(int id)
        {
            var data = _contractCompanyRepository.FindById(id);
            return _mapper.Map<ContractCompany, ContractCompanyViewModel>(data);
        }
        #endregion GET

        #region POST

        public ContractCompany Add(ContractCompanyViewModel vm, string companyCode)
        {
            vm.Status = Status.New;
            var entity = _mapper.Map<ContractCompany>(vm);
            entity.ContractNumber = $"HD{companyCode}{_contractCompanyRepository.FindAll().ToList().Count() + 1}";
            _contractCompanyRepository.Add(entity);
            return entity;
        }

        #endregion POST

        #region PUT

        public void Update(ContractCompanyViewModel Vm)
        {
            var data = _mapper.Map<ContractCompany>(Vm);
            _contractCompanyRepository.Update(data);
        }
        public async Task<bool> UpdateStatus(StatusContractViewModel vm)
        {
            var contract = _contractCompanyRepository.FindById(vm.contractId);
            if (contract == null)
            {
                return false;
            }
            contract.Status = vm.status != Status.New ? vm.status : Status.Expired;


            if (contract.Status == Status.Active)
            {
                var lstContract = _contractCompanyRepository.FindAll(x => x.CompanyId == vm.companyId && x.Status == Status.Active);
                foreach (var item in lstContract)
                {
                    if (item.Id != vm.contractId)
                    {
                        item.Status = Status.Expired;
                    }
                }
                _contractCompanyRepository.UpdateRange(lstContract);
            }
            else
            {
                contract.IsBreak = vm.IsBreak;
                contract.ReasonEnd = vm.ReasonEnd;
                _contractCompanyRepository.Update(contract);
            }
            if (contract.Status == Status.Active)
            {
                var lstUsers = _userRepository.FindAll().Where(x => x.CompanyId == vm.companyId && x.UserType == Roles.AdminCompany);
                foreach (var user in lstUsers)
                {
                    user.ContractNumber = contract.ContractNumber;
                    _userRepository.Update(user);
                }
            }

            return true;

        }
        #endregion PUT

        #region DELETE

        public bool Delete(int id)
        {
            var entity = _contractCompanyRepository.FindById(id);
            if (entity == null)
            {
                return false;
            }
            _contractCompanyRepository.RemoveFlg(entity);
            _contractCompanyRepository.Update(entity);

            return true;
        }

        #endregion DELETE

        #region OTHER_METHOD
        public bool CheckCanDelete(int companyId)
        {
            var lstContract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.Status != Status.New);
            if (lstContract != null && lstContract.Count() > 0)
            {
                return false;
            }
            return true;
        }

        public bool CheckMaxEmployee(int companyId)
        {
            var company = _userRepository.FindAll().Where(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany && x.DeleteFlag == StatusDelete.NON_DELETED).SingleOrDefault();
            if (company == null)
            {
                return false;
            }
            var contract = _contractCompanyRepository.FindSingle(x => x.CompanyId == companyId && x.ContractNumber == company.ContractNumber && x.DeleteFlag == StatusDelete.NON_DELETED);
            var lstEmployee = _userRepository.FindAll().Where(x => x.CompanyId == companyId && x.UserType == Roles.Employee && x.DeleteFlag == StatusDelete.NON_DELETED);
            if (contract == null || contract.MaxEmployee < lstEmployee.Count())
            {
                return false;
            }
            return true;
        }

        public bool CheckCanActive(int companyId, int contractId)
        {
            var user = _userRepository.FindAll(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany).SingleOrDefault();
            if (user == null)
            {
                return false;
            }
            var currentContract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber).SingleOrDefault();
            var contractToActive = _contractCompanyRepository.FindById(contractId);
            if (currentContract == null || currentContract.MaxEmployee > contractToActive.MaxEmployee)
            {
                return false;
            }
            return true;
        }
        public bool CheckCanDateActive(int companyId, int contractId)
        {

            var contractToActive = _contractCompanyRepository.FindById(contractId);
            if (contractToActive == null || contractToActive.EndDate < DateTime.Now)
            {
                return false;
            }
            return true;
        }
        public int GetMaxEmployee(int companyId)
        {
            var user = _userRepository.FindAll(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany).SingleOrDefault();
            if (user == null)
            {
                return 0;
            }
            var currentContract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber).SingleOrDefault();
            if (currentContract == null)
            {
                return 0;
            }
            return currentContract.MaxEmployee;
        }

        public ContractCompanyViewModel GetCurrentContract(int companyId)
        {
            var user = _userRepository.FindAll(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany).FirstOrDefault();
            if (user == null)
            {
                return null;
            }
            var contract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber).FirstOrDefault();
            if (contract == null)
            {
                return null;
            }
            return _mapper.Map<ContractCompanyViewModel>(contract);
        }



        #endregion OTHER_METHOD

    }
}
