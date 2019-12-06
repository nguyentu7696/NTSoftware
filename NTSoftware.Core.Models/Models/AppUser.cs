using NTSoftware.Core.Models.DomainEntity;
using NTSoftware.Core.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NTSoftware.Core.Models.Models
{

    namespace NTSoftware.Core.Models.Models
    {
        public class AppUser: DomainEntity<int>
        {
            [Required]
            [Column(TypeName = "varchar(50)")]
            public string UserName { get; set; }
            [Required]
            public string Password { get; set; }
            [Required]
            [Column(TypeName = "tinyint")]
            public Roles UserType { get; set; }
            [Column(TypeName = "tinyint")]
            public Status Status { get; set; }
            public int CompanyId { get; set; }
            [Column(TypeName = "varchar(50)")]
            public string ContractNumber { get; set; }
            [Column(TypeName = "nvarchar(255)")]
            public string Position { get; set; }
            public int DepartmentId { get; set; }
            public bool isLocked { get; set; }
            public string TokenReset { get; set; }
        }
    }

}
