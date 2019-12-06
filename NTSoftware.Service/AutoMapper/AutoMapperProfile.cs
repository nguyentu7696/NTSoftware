using AutoMapper;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Service.Interface.ViewModels;
using System;
using System.Collections.Generic;

using System.Text;

namespace NTSoftware.Service.AutoMapper
{
   public class AutoMapperProfile :Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ContractCompany, ContractCompanyViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CompanyDetail, CompanyDetailViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)) ;
            CreateMap<DetailUser,DetailUserViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<UserAdminViewModel, DetailUser>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<DetailUserViewModel, EmployeeViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CompanyFullViewModel, EmployeeViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CompanyFullViewModel, CompanyDetailViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<CompanyFullViewModel, ContractCompanyViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<EmployeeFullViewModel, EmployeeContractViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<EmployeeFullViewModel, DetailUserViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Project, ProjectViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Project, ProjectDetailViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Department, DetailDepartmentViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<Department, DepartmentViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AppUserViewModel, EmployeeViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AppUser, AppUserViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AppUserViewModel, AppUser>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<EmployeeContract, EmployeeContractViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<EmployeeProject, EmployeeProjectViewModel>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<RuleViewModel, Rule>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<OptionContractViewModel, Option>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<FunctionViewModel, Function>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<LogUsedTimeViewModel, LogUsedTime>().ReverseMap().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
