using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    [Table("CompanyDetail")]
    public class CompanyDetail : DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Email { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(MAX)")]
        public string CompanyName { set; get; }
        [Required]
        [Column(TypeName = "varchar(15)")]
        public string PhoneNumber { set; get; }
        [Required]
        public string Logo { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string CompanyCode { get; set; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string EmailRepresentative { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string RepresentativeName { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string PositionRepresentative { set; get; }
        [Required]
        public string Address  { set; get; }
    }
}
