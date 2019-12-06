using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
   public class Rule: DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "ntext")]
        public string Content { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string TypeContractName { get; set; }
        [Required]
        public int CompanyId { set; get; }       
    }
}
