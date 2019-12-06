using NTSoftware.Core.Models.DomainEntity;
using NTSoftware.Core.Models.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTSoftware.Core.Models.Models
{
    public class ContractCompany : DomainEntity<int>
    {
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
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string PositionRepresentativeB { set; get; }
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string CompanyName { set; get; }
        [Required]
        public string Address { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string ContractNumber { set; get; }
        [Required]
        [Column(TypeName = "ntext")]
        public string ContentRule { set; get; }
        [Required]
        public DateTime StartDate { set; get; }
        [Required]
        public DateTime? EndDate { get; set; }
        public Status Status { set; get; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string ReasonEnd { get; set; }
        public int CompanyId { set; get; }
        [Column(TypeName = "decimal(18,0)")]
        [Required]
        public decimal PriceContract { get; set; }
        [Column(TypeName = "decimal(18,0)")]
        public decimal Compensation { get; set; }
        [Required]
        public int MaxEmployee { get; set; }
        public bool IsBreak { get; set; }
    }
}
