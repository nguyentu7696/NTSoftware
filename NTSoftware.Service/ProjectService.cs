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

namespace NTSoftware.Service
{
    public class ProjectService : IProjectService
    {
        #region CONTRUCTOR

        private IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private IProjectRepository _projectRepository;
        private IUserRepository _userRepository;
        private IDetailUserRepository _detailUserRepository;
        private IEmployeeProjectRepository _employeeProjectRepository;

        public ProjectService(IUnitOfWork unitOfWork, IMapper mapper, IProjectRepository projectRepository, IUserRepository userRepository,
            IDetailUserRepository detailUserRepository, IEmployeeProjectRepository employeeProjectRepository)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _projectRepository = projectRepository;
            _userRepository = userRepository;
            _detailUserRepository = detailUserRepository;
            _employeeProjectRepository = employeeProjectRepository;
        }


        #endregion CONTRUCTOR

        #region GET

        public ProjectDetailViewModel GetById(int id)
        {
            var project = _projectRepository.FindById(id);
            if (project == null)
            {
                return null;
            }
            var data = _mapper.Map<Project, ProjectDetailViewModel>(project);
            var manager = _detailUserRepository.FindAll(x => x.Id == project.ManagerId).SingleOrDefault();
            if (manager != null)
            {
                data.ManagerName = manager.Name;
            }
            return data;
        }

        public PagedResult<ProjectViewModel> GetAllPaging(int page, int pageSize, int companyId, string description)
        {

            try
            {
                var project = _projectRepository.FindAll(x => x.CompanyId == companyId && x.DeleteFlag == StatusDelete.NON_DELETED);
                var users = _detailUserRepository.FindAll(x => x.DeleteFlag == StatusDelete.NON_DELETED);
                var employeeProject = _employeeProjectRepository.FindAll(x => x.DeleteFlag == StatusDelete.NON_DELETED);

                var query = (from p in project
                             select new ProjectViewModel()
                             {
                                 Id = p.Id,
                                 CompanyId = p.CompanyId,
                                 Description = p.Description,
                                 EndDate = p.EndDate,
                                 ManagerId = p.ManagerId,
                                 ManagerName = users.SingleOrDefault(x => x.Id == p.ManagerId).Name,
                                 ProjectName = p.ProjectName,
                                 StartDate = p.StartDate,
                                 employeeCount = employeeProject.Where(x => x.ProjectId == p.Id).Count(),

                             });
                int totalRow = query.Count();
                query = query.Skip((page - 1) * pageSize).Take(pageSize);
                var paginationSet = new PagedResult<ProjectViewModel>()
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
                return new PagedResult<ProjectViewModel>()
                {
                    Results = new List<ProjectViewModel>(),
                    CurrentPage = page,
                    RowCount = 0,
                    PageSize = pageSize
                };
            }
        }

        #endregion GET

        #region POST
        public Project Add(ProjectDetailViewModel vm)
        {
            var entity = _mapper.Map<ProjectDetailViewModel, Project>(vm);
            _projectRepository.Add(entity);
            SaveChanges();
            if (vm.lstEmployee.Count > 0)
            {
                foreach (var item in vm.lstEmployee)
                {
                    if (_detailUserRepository.FindById(item) != null)
                    {
                        _employeeProjectRepository.Add(new EmployeeProject() { UserID = item, ProjectId = entity.Id, JoinDate = DateTime.Now });
                    }
                }
                SaveChanges();
            }
            return entity;
        }

        #endregion POST

        #region PUT

        private void SaveChanges()
        {
            _unitOfWork.Commit();
        }

        public bool Update(ProjectDetailViewModel Vm)
        {
            var entity = _projectRepository.FindById(Vm.Id);
            if (entity == null)
            {
                return false;
            }
            _mapper.Map(Vm, entity);
            _projectRepository.Update(entity);
            SaveChanges();
            var lstEmployeProject = _employeeProjectRepository.FindAll(x => x.ProjectId == Vm.Id);
            _employeeProjectRepository.DeleteRange(lstEmployeProject);

            if (Vm.lstEmployee.Count > 0)
            {
                foreach (var item in Vm.lstEmployee)
                {
                    if (_detailUserRepository.FindById(item) != null)
                    {
                        _employeeProjectRepository.Add(new EmployeeProject() { UserID = item, ProjectId = entity.Id, JoinDate = DateTime.Now });
                    }
                }

            }
            SaveChanges();
            return true;
        }

        #endregion PUT

        #region DELETE

        public void Delete(int id)
        {
            var entity = _projectRepository.FindById(id);
            _projectRepository.RemoveFlg(entity);
            _projectRepository.Update(entity);
            SaveChanges();
        }

        #endregion DELETE

        #region OTHER_METHOD

        #endregion OTHER_METHOD
    }
}
