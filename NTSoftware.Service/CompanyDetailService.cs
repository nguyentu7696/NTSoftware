using AutoMapper;
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared;
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

namespace NTSoftware.Service
{
    public class CompanyDetailService : ICompanyDetailService
    {
        #region Contructor

        private readonly IMapper _mapper;
        private IUnitOfWork _unitOfWork;
        private ICompanyRepository _companyRepository;
        private IContractCompanyRepository _contractCompanyRepository;
        private IUserRepository _userRepository;

        public CompanyDetailService(IMapper mapper, IUnitOfWork unitOfWork, ICompanyRepository companyRepository,
            IContractCompanyRepository contractCompanyRepository, IUserRepository userRepository)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _companyRepository = companyRepository;
            _contractCompanyRepository = contractCompanyRepository;
            _userRepository = userRepository;
        }


        #endregion Contructor

        #region GET

        public List<CompanyDetailViewModel> GetAll()
        {
            var data = _companyRepository.FindAll().ToList();
            return _mapper.Map<List<CompanyDetail>, List<CompanyDetailViewModel>>(data);
        }

        public PagedResult<CompanyDetailViewModel> GetAllPaging(int page, int pageSize, string nameCompany,
            string phoneNumber, string address,
            string representativeName, string positionRepresentative)
        {
            string newPhone = Utilities.ConvertToUnSign(phoneNumber);
            string newNameCompany = Utilities.ConvertToUnSign(nameCompany);
            string newRepresentativeName = Utilities.ConvertToUnSign(representativeName);
            string newPositionRepresentative = Utilities.ConvertToUnSign(positionRepresentative);

            var query = _companyRepository.Find(x => Utilities.ConvertToUnSign(x.CompanyName).Contains(newNameCompany) &&
             Utilities.ConvertToUnSign(x.PhoneNumber).Contains(newPhone) &&
              Utilities.ConvertToUnSign(x.RepresentativeName).Contains(newRepresentativeName) &&
               Utilities.ConvertToUnSign(x.PositionRepresentative).Contains(newPositionRepresentative));

            int totalRow = query.Count();
            query = query.Skip((page - 1) * pageSize).Take(pageSize);
            //  var user = _userManager.Users.Where(x=>x.UserType == Roles.AdminCompany)
            var data = _mapper.Map<List<CompanyDetail>, List<CompanyDetailViewModel>>(query.ToList()).Select(c =>
            {
                c.ContractNumber = _contractCompanyRepository.GetCurrentContractNumber(c.Id); return c;
            }).ToList();
            data = data.Select(c =>
            {
                c.ContractId = _contractCompanyRepository.GetSingleOrDefault(y => y.CompanyId == c.Id && y.ContractNumber == c.ContractNumber)
                == null ? -1 : _contractCompanyRepository.GetSingleOrDefault(y => y.CompanyId == c.Id && y.ContractNumber == c.ContractNumber).Id;
                return c;
            }).ToList();
            var paginationSet = new PagedResult<CompanyDetailViewModel>()
            {
                Results = data,
                CurrentPage = page,
                RowCount = totalRow,
                PageSize = pageSize
            };
            return paginationSet;

        }

        public CompanyDetailViewModel GetById(int id)
        {
            var model = _companyRepository.FindById(id);
            var company = _mapper.Map<CompanyDetail, CompanyDetailViewModel>(model);
            return company;
        }


        public CompanyDetailViewModel GetByEmail(string email)
        {
            return null;
        }
        #endregion GET

        #region POST

        public CompanyDetail Add(CompanyDetailViewModel Vm)
        {
            var entity = _mapper.Map<CompanyDetail>(Vm);
            entity.CompanyCode = _companyRepository.GenCompanyCode(Vm.CompanyName);
            _companyRepository.Add(entity);
            return entity;
        }

        #endregion POST

        #region PUT

        public bool Update(CompanyDetailViewModel Vm)
        {
            var company = _companyRepository.FindById(Vm.Id);
            if (company == null)
            {
                return false;
            }
            _mapper.Map(Vm, company);
            _companyRepository.Update(company);
            return true;
        }

        #endregion PUT

        #region DELETE

        public void DeleteCompany(int id)
        {
            var entity = _companyRepository.FindById(id);
            _companyRepository.RemoveFlg(entity);
            _companyRepository.Update(entity);
        }

        #endregion DELETE

        #region OTHER_METHOD

        public GenericResult CheckCompanyExpried(int id)
        {
            var checkCompany = CheckCompanyExist(id);
            if (checkCompany == false)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_NOT_EXITS, ErrorCode.NOT_EXIST_COMPANY_CODE);
            }
            var userCompany = _userRepository.FindAll(x => x.DeleteFlag == StatusDelete.NON_DELETED && x.CompanyId == id
            && x.UserType == Roles.AdminCompany).SingleOrDefault();
            if (userCompany == null)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_NOT_EXITS, ErrorCode.NOT_EXIST_COMPANY_CODE);
            }
            var contractCompany = _contractCompanyRepository.Find(x => x.CompanyId == id && x.ContractNumber == userCompany.ContractNumber).SingleOrDefault();
            if (contractCompany == null)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_EXPRIED, ErrorCode.EXPIRES_COMPANY_CODE);
            }
            if (contractCompany.Status == Status.New)
            {
                return new GenericResult(null, false, ErrorMsg.CONTRACT_NEW, ErrorCode.ERROR_CODE);
            }
            if (contractCompany.Status == Status.Expired)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_EXPRIED, ErrorCode.ERROR_CODE);
            }
            if (contractCompany.EndDate < DateTime.Now)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_EXPRIED, ErrorCode.EXPIRES_COMPANY_CODE);
            }
            else if (contractCompany.StartDate > DateTime.Now)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_NOT_READY, ErrorCode.NOT_READY_COMPANY_CODE);
            }
            if (contractCompany.Status != Status.Active)
            {
                return new GenericResult(null, false, ErrorMsg.COMPANY_EXPRIED, ErrorCode.ERROR_CODE);
            }
            return null;
        }

        public bool CheckCompanyExist(int id)
        {
            var company = _companyRepository.FindById(id);
            return company == null ? false : true;
        }

        public bool CheckEmailCompany(string email)
        {
            if (email == null)
            {
                return false;
            }
            var company = _companyRepository.FindAll(x => x.Email == email).SingleOrDefault();
            return company == null;

        }

        #endregion OTHER_METHOD
    }
}
