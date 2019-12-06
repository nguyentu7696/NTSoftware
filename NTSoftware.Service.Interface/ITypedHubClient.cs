using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Service.Interface
{
    public interface ITypedHubClient
    {
        Task BroadcastMessage(string type, string payload);
    }
}
