using NTSoftware.Core.Models.DomainEntity;
using NTSoftware.Core.Models.Models.Interface;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace NTSoftware.Core.Models.Models
{
    public class EmployeeProject
    {
        [Required]
        public int UserID { set; get; }
        [Required]
        public int ProjectId { set; get; }
        [Required]
        public DateTime JoinDate { set; get; }
        public DateTime? OutDate { set; get; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int DeleteFlag { get; set; }
    }
}
