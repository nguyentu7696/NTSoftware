using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class RuleViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="Nội dung điều khoản không được trống")]
        public string Content { set; get; }
        [Required(ErrorMessage = "Loại điều khoản không được trống")]
        public string TypeContractName { get; set; }
        [Required(ErrorMessage = "Mã công ty không được trống")]
        public int CompanyId { set; get; }
        public DateTime CreatedDate { get; set; }
    }
}
