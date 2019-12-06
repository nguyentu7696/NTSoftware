using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    public class Option : DomainEntity<int>
    {
       
        [Required]
        [Column(TypeName ="nvarchar(150)")]
        public string OptionName { get; set; }
        [Column(TypeName ="nvarchar(MAX)")]
        public string Description { get; set; }
        [Column(TypeName = "decimal(18,0)")]
        [Required]
        [Range(0.00001, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
