using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service.Interface;

namespace NTSoftware.Controllers
{
    public class LogUseTimeController : BaseController
    {
        #region CONTRUCTOR
        private ILogUsedTimeService _logUsedTimeService;

        public LogUseTimeController(ILogUsedTimeService logUsedTimeService)
        {
            _logUsedTimeService = logUsedTimeService;
        }

        #endregion CONTRUCTOR

        #region GET

        [HttpGet]
        [Route("GetTotalByMonth")]
        //[Authorize(Roles = "AdminNT")]
        public IActionResult GetPaging(int month, int year, int companyId, bool isPayed)
        {
            try
            {

                var result = _logUsedTimeService.GetTotalByMonth(month, year, companyId, isPayed);
                return new OkObjectResult(new GenericResult(result, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }

        #endregion GET
    }
}