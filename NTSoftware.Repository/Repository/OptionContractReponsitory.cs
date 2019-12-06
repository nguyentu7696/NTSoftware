using NTSoftware.Core.Models.Models;
using NTSoftware.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Text;

namespace NTSoftware.Repository.Repository
{
    public class OptionContractReponsitory : NTRepository<Option, int>, IOptionContractReponsitory
    {
        public OptionContractReponsitory(AppDbContext context) : base(context)
        {
        }
    }
}
