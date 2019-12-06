using NTSoftware.Core.Models.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class AppUserViewModel
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Password { get; set; }
        public int Id { get; set; }
        [Required]
        public Status Status { get; set; }
        public Roles UserType { get; set; }

        public int CreatedBy { get; set; }
        public int CompanyId { get; set; }
        public string Position { get; set; }
        public int DepartmentId { get; set; }
        public string ContractNumber { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
