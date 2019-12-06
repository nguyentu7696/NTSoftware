using AutoMapper;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Dtos;
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
    public class LogUsedTimeService : ILogUsedTimeService
    {
        #region CONTRUCTOR
        private ILogUsedTimeRepository _logUsedTimeRepository;
        private IMapper _mapper;
        private IDetailUserRepository _detailUserRepository;
        private IContractCompanyRepository _contractCompanyRepository;
        private IUserRepository _userRepository;
        private IUnitOfWork _unitOfWork;

        public LogUsedTimeService(ILogUsedTimeRepository logUsedTimeRepository, IMapper mapper, IDetailUserRepository detailUserRepository, IUnitOfWork unitOfWork, IUserRepository userRepository, IContractCompanyRepository contractCompanyRepository)
        {
            _logUsedTimeRepository = logUsedTimeRepository;
            _mapper = mapper;
            _detailUserRepository = detailUserRepository;
            _unitOfWork = unitOfWork;
            _userRepository = userRepository;
            _contractCompanyRepository = contractCompanyRepository;
        }


        #endregion CONTRUCTOR

        #region GET

        public PagedResult<LogUsedTimeViewModel> GetPagingByCompany(int companyId, int month, int year, int pageIndex, int pageSize, bool isPayed)
        {
            try
            {
                var query = _logUsedTimeRepository.FindAll(x => x.CompanyId == companyId && x.LogoutTime.Month == month && x.LogoutTime.Year == year && x.IsPayed == isPayed);
                int totalRow = query.Count();
                query = query.OrderByDescending(x => x.LogedTime).Skip((pageIndex - 1) * pageSize).Take(pageSize);
                var users = _detailUserRepository.FindAll();
                var data = (from u in users
                            join l in query on u.Id equals l.UserId
                            select new LogUsedTimeViewModel()
                            {
                                UserId = u.Id,
                                Id = l.Id,
                                CompanyId = l.CompanyId,
                                EmployeeName = u.Name,
                                IsPayed = isPayed,
                                LogedTime = l.LogedTime,
                                LogoutTime = l.LogoutTime,
                                SecondUsed = l.SecondUsed,
                                Price = l.Price,
                            }).ToList();
                var paginationSet = new PagedResult<LogUsedTimeViewModel>()
                {
                    Results = data,
                    CurrentPage = pageIndex,
                    RowCount = totalRow,
                    PageSize = pageSize
                };
                return paginationSet;
            }
            catch
            {
                var paginationSet = new PagedResult<LogUsedTimeViewModel>()
                {
                    Results = new List<LogUsedTimeViewModel>(),
                    CurrentPage = pageIndex,
                    RowCount = 0,
                    PageSize = pageSize
                };
                return paginationSet;
            }
        }

        public double GetTotalByMonth(int month, int year, int companyId,bool isPayed)
        {
            var query = _logUsedTimeRepository.FindAll(x => x.CompanyId == companyId && x.LogoutTime != x.LogedTime && x.LogoutTime.Month == month && x.LogoutTime.Year == year && x.IsPayed == isPayed);
            return double.Parse(query.ToList().Sum(x => x.Price).ToString());
        }
        #endregion GET

        #region POST
        public void SetLogIn(int userId, int companyId)
        {
            var entities = _logUsedTimeRepository.FindAll(x => x.UserId == userId && x.LogoutTime == x.LogedTime);
            foreach (var item in entities)
            {
                if ((DateTime.Now - item.LogedTime).Seconds > 7200)
                {
                    item.LogoutTime = item.LogedTime.AddHours(2);
                }
                else
                {
                    item.LogoutTime = DateTime.Now;
                    item.SecondUsed = (DateTime.Now - item.LogedTime).Seconds;
                }
            }
            _logUsedTimeRepository.UpdateRange(entities);
            SaveChanges();
            var now = DateTime.Now;

            _logUsedTimeRepository.Add(new LogUsedTime() { IsPayed = false, LogedTime = now, CompanyId = companyId, SecondUsed = 0, UserId = userId, LogoutTime = now, Price = 0 });
            SaveChanges();
        }

        public void SetLogOut(int userId, int companyId)
        {
            var entities = _logUsedTimeRepository.FindAll(x => x.UserId == userId && x.LogoutTime == x.LogedTime);
            var user = _userRepository.FindAll(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany).FirstOrDefault();
            var contract = _contractCompanyRepository.FindAll(x => x.CompanyId == companyId && x.ContractNumber == user.ContractNumber).SingleOrDefault();
            foreach (var item in entities)
            {
                if ((DateTime.Now - item.LogedTime).Seconds > 7200)
                {
                    item.LogoutTime = item.LogedTime.AddHours(2);
                    item.SecondUsed = 72000;
                    item.Price = item.SecondUsed * (contract.PriceContract / 86400);
                }
                else
                {
                    item.LogoutTime = DateTime.Now;
                    item.SecondUsed = int.Parse(Math.Round((DateTime.Now - item.LogedTime).TotalSeconds, 0).ToString());
                    item.Price = item.SecondUsed * (contract.PriceContract / 86400);
                }
            }
            _logUsedTimeRepository.UpdateRange(entities);
            SaveChanges();
        }

        #endregion POST

        #region PUT

        public void PayByMonth(int month, int year, int companyId)
        {
            var entities = _logUsedTimeRepository.FindAll(x => x.LogoutTime.Month == month && x.LogoutTime.Year == year && x.CompanyId == companyId && x.IsPayed == false);
            foreach (var item in entities)
            {
                item.IsPayed = true;
            }
            _logUsedTimeRepository.UpdateRange(entities);
            SaveChanges();
        }
        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }



        #endregion PUT

        #region DELETE

        #endregion DELETE

        #region OTHER

        #endregion OTHER

    }
}
