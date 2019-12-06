using AutoMapper;
using AutoMapper.QueryableExtensions;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Interface;
using NTSoftware.Repository.Interface;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NTSoftware.Service
{
    public class FunctionService : IFunctionService
    {
        #region CONTRUCTOR

        private IFunctionRepository _functionRepository;
        private IUserRepository _userRepository;
        private IUnitOfWork _unitOfWork;
        private IContractCompanyRepository _contractCompanyRepository;
        private IMapper _mapper;
        private ICompanyRepository _companyRepository;

        public FunctionService(IFunctionRepository functionRepository, IUserRepository userRepository, IContractCompanyRepository contractCompanyRepository, IMapper mapper, IUnitOfWork unitOfWork, ICompanyRepository companyRepository)
        {
            _functionRepository = functionRepository;
            _userRepository = userRepository;
            _contractCompanyRepository = contractCompanyRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _companyRepository = companyRepository;
        }

        #endregion CONTRUCTOR

        #region GET

        public List<FunctionViewModel> GetAllByContract(int companyId)
        {
            var user = _userRepository.FindAll(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany).SingleOrDefault();
            if (user == null)
            {
                return new List<FunctionViewModel>();
            }
            var contract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber).SingleOrDefault();
            if (contract == null)
            {
                return new List<FunctionViewModel>();
            }
            return _mapper.Map<List<FunctionViewModel>>(_functionRepository.FindAll(x => x.ContractId == contract.Id).ToList());
        }

        #endregion GET

        #region POST

        public void AddByOption(int optionId, int contractId)
        {
            //var oldFunction = _functionRepository.FindAll(x => x.ContractId == contractId);
            //_functionRepository.DeleteRange(oldFunction);
            //SaveChanges();
            var lstFunction = _functionRepository.FindAll(x => x.OptionId == optionId && x.ContractId == 0).ToList();
            var lstFunctionAdd = _mapper.Map<List<FunctionViewModel>>(lstFunction);
            _functionRepository.AddRange(_mapper.Map<List<Function>>(lstFunctionAdd.Select(x => { x.Id = 0; x.ContractId = contractId; return x; }).ToList()).AsEnumerable());
            SaveChanges();
        }


        #endregion POST

        #region PUT

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public bool CheckHasFunction(int companyId, string functionName)
        {
            var user = _userRepository.FindSingle(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany);
            if(user == null)
            {
                return false;
            }
            var contract = _contractCompanyRepository.FindSingle(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber);
            if (contract == null)
            {
                return false;
            }
            var function = _functionRepository.FindSingle(x => x.ContractId == contract.Id && x.Name == functionName);
            return function != null;
        }

        #endregion PUT

        #region DELETE

        #endregion DELETE

    }
}
