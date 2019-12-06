﻿using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Repository.Interface;
using System;
using System.Linq;

namespace NTSoftware.Repository.Repository
{
    public class ContractCompanyRepository : NTRepository<ContractCompany, int>, IContractCompanyRepository
    {
        private AppDbContext _appContext;
        public ContractCompanyRepository(AppDbContext context) : base(context)
        {
            _appContext = context;
        }

        public string GetLastestContractNumber(int companyId)
        {
            var lstContractCompany = FindAll(x => x.CompanyId == companyId).ToList();
            if (lstContractCompany.Count > 0)
            {
                var contractActive = lstContractCompany.Where(x => x.Status == Status.Active).SingleOrDefault();
                if (contractActive != null)
                {
                    return contractActive.ContractNumber;
                }
                var contractInActive = lstContractCompany.Where(x => x.Status == Status.Expired).OrderBy(x => x.UpdatedDate).LastOrDefault();
                if (contractInActive != null)
                {
                    return contractInActive.ContractNumber;
                }
                var contractNew = lstContractCompany.Where(x => x.Status == Status.New).OrderBy(x => x.CreatedDate).LastOrDefault();
                if (contractNew != null)
                {
                    return contractNew.ContractNumber;
                }
            }
            return null;
        }
        public string GetCurrentContractNumber(int companyId)
        {
            var user = _appContext.Set<AppUser>().Where(x => x.CompanyId == companyId && x.UserType == Roles.AdminCompany && x.ContractNumber != null && x.DeleteFlag == StatusDelete.NON_DELETED).SingleOrDefault();
            if(user == null)
            {
                return "";
            }
            return user.ContractNumber;
        }
    }
}
