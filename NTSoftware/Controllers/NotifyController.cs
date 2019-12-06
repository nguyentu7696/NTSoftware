using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;
using NTSoftware.Service;
using NTSoftware.Service.Interface;
using NTSoftware.ViewModel.Notify;

namespace NTSoftware.Controllers
{
    public class NotifyController : BaseController
    {
        #region CONTRUCTOR
        private IHubContext<NotifyHub> _hubContext;

        public NotifyController(IHubContext<NotifyHub> hubContext)
        {
            _hubContext = hubContext;
        }

        #endregion CONTRUCTOR

        #region POST
        [HttpPost]
        [Route("AuthenUser")]
        public IActionResult LoggedIn([FromBody]AuthenUserMessage msg)
        {
            string retMessage = string.Empty;
            try
            {
                _hubContext.Clients.All.SendAsync("authenUser", msg);
                retMessage = "Success";
            }
            catch (Exception e)
            {
                retMessage = e.ToString();
            }
            return new OkObjectResult(new GenericResult(null,true,ErrorMsg.SUCCEED,ErrorCode.SUCCEED_CODE));
        }

        [HttpPost]
        [Route("BlockUser")]
        public IActionResult BlockUser([FromBody]BlockUserMessage msg)
        {
            string retMessage = string.Empty;
            try
            {
                _hubContext.Clients.All.SendAsync("blockUser", msg);
                retMessage = "Success";
            }
            catch (Exception e)
            {
                retMessage = e.ToString();
            }
            return new OkObjectResult(new GenericResult(null, true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
        }
        #endregion POST
    }
}