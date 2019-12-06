using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
   public class FunctionViewModel
    {
        public int Id { get; set; }
        public int OptionId { get; set; }
        [Required(ErrorMessage ="Tên chức năng không được trông")]
        public string Name { get; set; }
        public int ContractId { get; set; }
        [Required(ErrorMessage ="Đường dẫn không được trống")]
        public string Url { get; set; }
        [Required(ErrorMessage ="Tên Icon không được trống")]
        public string IconName { get; set; }
    }
}
