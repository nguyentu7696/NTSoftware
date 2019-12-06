using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Repository.Interface
{
   public interface IUserRepository : IRepository<AppUser, int>
    {
        AppUser CreateAsync(AppUser entity, string password);
        AppUser GetByUserName( string userName);
        string CreateTokenChangePassword(AppUser user);
        bool CheckTokenChangePassword(AppUser user, string token);
    }
}
