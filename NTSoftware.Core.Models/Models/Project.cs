using NTSoftware.Core.Models.DomainEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    [Table("Project")]
    public class Project :DomainEntity<int>
    {
        [Required]
        [Column(TypeName = "nvarchar(150)")]
        public string ProjectName { set; get; }
        [Required]
        public string Description { set; get; }
        public DateTime StartDate { set; get; }
        public DateTime? EndDate { set; get; }
        [Required]
        public int CompanyId { set; get; }
        public int ManagerId { set; get; }
        public bool IsFinished { get; set; }
        public DateTime? ExactlyEndDate { set; get; }

    }
}
