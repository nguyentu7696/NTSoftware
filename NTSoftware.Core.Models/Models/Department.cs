using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    [Table("Department")]
    public class Department : DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string DepartmentName { set; get; }
        [Required]
        [Column(TypeName = "varchar(20)")]
        public string PhoneNumber { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string Email { set; get; }
        [Required]
        public string Address { set; get; }
        [Required]
        public string Description { set; get; }
        public int ManagerId { set; get; }
        public int CompanyId { set; get; }
    }
}
