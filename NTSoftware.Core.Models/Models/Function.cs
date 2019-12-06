using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
   public class Function: DomainEntity<int>
    {
        public int OptionId { get; set; }
        [Required]
        [Column(TypeName ="nvarchar(150)")]
        public string Name { get; set; }
        public int ContractId { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        public string IconName { get; set; }
    }
}
