using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class OptionContractViewModel
    {
        public int Id { get; set; }
        [Required]
        public string OptionName { get; set; }
        public List<FunctionViewModel> lstFunction { get; set; }
        public string Description { get; set; }
        [Range(0.00001, double.MaxValue,ErrorMessage ="Tiền option phải lớn hơn 0")]
        [Required(ErrorMessage = "Giá option không được trống")]
        public decimal Price { get; set; }
    }
}
