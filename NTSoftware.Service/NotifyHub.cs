using Microsoft.AspNetCore.SignalR;
using NTSoftware.Service.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Service
{
   public class NotifyHub: Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }
    }
}
