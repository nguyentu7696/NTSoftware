using NTSoftware.Core.Models.Models;
using NTSoftware.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Repository.Repository
{
    public class FunctionRepository : NTRepository<Function, int>, IFunctionRepository
    {
        private AppDbContext _appContext;
        public FunctionRepository(AppDbContext context) : base(context)
        {
            _appContext = context;
        }
    }
}
