using AutoMapper;
using AutoMapper.QueryableExtensions;
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
    public class OptionContractService : IOptionContractService
    {
        #region CONTRUCTOR

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IOptionContractReponsitory _priceContractReponsitory;
        private readonly IFunctionRepository _functionRepository;

        public OptionContractService(IUnitOfWork unitOfWork, IOptionContractReponsitory priceContractReponsitory, IMapper mapper, IFunctionRepository functionRepository)
        {
            _unitOfWork = unitOfWork;
            _priceContractReponsitory = priceContractReponsitory;
            _mapper = mapper;
            _functionRepository = functionRepository;
        }

        #endregion CONTRUCTOR

        #region GET

        public List<OptionContractViewModel> GetAll()
        {
            var query = _priceContractReponsitory.FindAll().ToList();
            var data = _mapper.Map<List<Option>, List<OptionContractViewModel>>(query);
            return data;
        }

        public PagedResult<OptionContractViewModel> GetPaging(int page, int pageSize)
        {
            try
            {
                var query = _priceContractReponsitory.FindAll();
                int totalRow = query.Count();
                query = query.OrderBy(x => x.OptionName)
                .Skip((page - 1) * pageSize).Take(pageSize);

                var lstFuntion = _mapper.Map<List<FunctionViewModel>>(_functionRepository.FindAll(x => x.ContractId == 0)).ToList();
                var data = _mapper.Map<List<Option>, List<OptionContractViewModel>>(query.ToList());
                var paginationSet = new PagedResult<OptionContractViewModel>()
                {
                    Results = data.Select(x => { x.lstFunction = lstFuntion.Where(y => y.OptionId == x.Id).ToList(); return x; }).ToList(),
                    CurrentPage = page,
                    RowCount = totalRow,
                    PageSize = pageSize
                };
                return paginationSet;
            }
            catch (Exception ex)
            {
                return new PagedResult<OptionContractViewModel>()
                {
                    Results = new List<OptionContractViewModel>(),
                    CurrentPage = page,
                    RowCount = 0,
                    PageSize = pageSize
                };
            }
        }

        #endregion GET

        #region POST

        public Option Add(OptionContractViewModel Vm)
        {
            var entity = _mapper.Map<OptionContractViewModel, Option>(Vm);
            _priceContractReponsitory.Add(entity);
            SaveChanges();
            var lstFunction = _mapper.Map<List<FunctionViewModel>, List<Function>>(Vm.lstFunction).Select(x => { x.ContractId = 0; x.OptionId = entity.Id; return x; });
            _functionRepository.AddRange(lstFunction.AsEnumerable());
            SaveChanges();
            return entity;

        }

        #endregion POST

        #region PUT

        public bool Update(OptionContractViewModel Vm)
        {
            var entity = _priceContractReponsitory.FindById(Vm.Id);
            if (entity == null)
            {
                return false;
            }
            entity = _mapper.Map(Vm, entity);
            _priceContractReponsitory.Update(entity);
            SaveChanges();
            var lstFunction = _functionRepository.FindAll(x => x.ContractId == 0 && x.OptionId == Vm.Id);
            _functionRepository.DeleteRange(lstFunction);
            SaveChanges();
            var lstFunctionNew = _mapper.Map<List<FunctionViewModel>, List<Function>>(Vm.lstFunction).Select(x => { x.Id = 0; x.ContractId = 0; x.OptionId = entity.Id; return x; });
            _functionRepository.AddRange(lstFunctionNew);
            SaveChanges();
            return true;
        }
        public void SaveChanges()
        {
            _unitOfWork.Commit();
        }
        #endregion PUT

        #region DELETE

        public bool Delete(int id)
        {
            var entity = _priceContractReponsitory.FindById(id);
            if (entity == null)
            {
                return false;
            }
            _priceContractReponsitory.RemoveFlg(entity);
            _priceContractReponsitory.Update(entity);
            SaveChanges();
            return true;
        }

        #endregion DELETE
    }
}
