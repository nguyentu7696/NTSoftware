using NTSoftware.Core.Models.DomainEntity;
using NTSoftware.Core.Models.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    public class DetailUser : DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string Name { set; get; }
        [Required]
        [Column(TypeName = "varchar(50)")]
        public string EmployeeKey { get; set; }
        [Required]
        [Column(TypeName = "varchar(20)")]
        public string IdentityCard { set; get; }
        public DateTime Birthday { set; get; }
        [Column(TypeName = "tinyint")]
        public Gender Gender { set; get; }
        [Required]
        [Column(TypeName = "varchar(20)")]
        public string PhoneNumber { set; get; }
        [Required]
        public string Address { set; get; }
    }

}
