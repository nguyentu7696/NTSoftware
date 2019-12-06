using NTSoftware.Core.Models.Models;
using NTSoftware.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Repository.Repository
{
    public class LogUsedTimeRepository : NTRepository<LogUsedTime, int>, ILogUsedTimeRepository
    {
        public LogUsedTimeRepository(AppDbContext context) : base(context)
        {
        }
    }
}
