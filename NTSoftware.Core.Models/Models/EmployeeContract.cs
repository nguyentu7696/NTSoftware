using NTSoftware.Core.Models.DomainEntity;
using NTSoftware.Core.Models.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    public class EmployeeContract : DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string ContractNumber { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string EmailRepresentativeA { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string RepresentativeNameA { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string PositionRepresentativeA { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string EmailRepresentativeB { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string RepresentativeNameB { set; get; }
        [Column(TypeName = "ntext")]
        [Required]
        public string ContentRule { get; set; }
        public int EmployeeId { set; get; }
        public DateTime StrartDate { get; set; }
        public DateTime EndDate { get; set; }
        [Column(TypeName = "tinyint")]
        public Status Status { get; set; }
        public int CompanyId { set; get; }
        [Column(TypeName = "decimal(18,0)")]
        [Range(0.0001,double.MaxValue)]
        public decimal SalaryContract { get; set; }
    }
}
