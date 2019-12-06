using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface;
using NTSoftware.Service.Interface.ViewModels;

namespace NTSoftware.Controllers
{
    public class OptionContractController : BaseController
    {
        #region CONTRUCTOR
        private readonly IOptionContractService _priceContractService;

        public OptionContractController(IOptionContractService priceContractService)
        {
            _priceContractService = priceContractService;
        }

        #endregion CONTRUCTOR

        #region GET
        [HttpGet]
        [Route("GetAll")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _priceContractService.GetAll();
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        [HttpGet]
        [Route("GetPaging")]
       // [Authorize(Roles = "AdminNT")]
        public IActionResult GetPaging(int pageIndex = 1, int pageSize = 20)
        {
            try
            {
                if (pageIndex < 1)
                {
                    pageIndex = 1;
                }
                if (pageSize < 1)
                {
                    pageSize = 20;
                }
                var data = _priceContractService.GetPaging(pageIndex, pageSize);
                return new OkObjectResult(new GenericResult(data, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion GET

        #region POST

        [HttpPost]
        [Route("Add")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult Add([FromBody] OptionContractViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var entity = _priceContractService.Add(Vm);
                return new OkObjectResult(new GenericResult(entity, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion POST

        #region PUT

        [HttpPut]
        [Route("Update")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult Update([FromBody] OptionContractViewModel Vm)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var allErrors = ModelState.Values.SelectMany(v => v.Errors);
                    return new BadRequestObjectResult(new GenericResult(allErrors, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                if (Vm.Id == 0)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var result = _priceContractService.Update(Vm);
                if (result == false)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.PRICE_CONTRACT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion PUT

        #region DELETE

        [HttpDelete]
        [Route("Delete")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult Delete(int id)
        {
            try
            {
                if (id == 0)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.DATA_REQUEST_IN_VALID, ErrorCode.ERROR_HANDLE_DATA));
                }
                var result = _priceContractService.Delete(id);
                if (result == false)
                {
                    return new BadRequestObjectResult(new GenericResult(null, false, ErrorMsg.PRICE_CONTRACT_NOT_EXIST, ErrorCode.ERROR_CODE));
                }
                return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion DELETE

        #region OTHER_METHOD

        #endregion OTHER_METHOD
    }
}