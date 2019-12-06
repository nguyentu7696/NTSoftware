using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    
    public class ContractCompanyViewModel
    {
        public int Id { get; set; }
        public int OptionId { get; set; }
        [Required(ErrorMessage = "Email người đại diện bên A không được để trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email người đại diện bên A không đúng định dạng")]
        public string EmailRepresentativeA { set; get; }
        [Required(ErrorMessage = "Tên người đại diện bên A không được để trống")]
        public string RepresentativeNameA { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện bên A không được để trống")]
        public string PositionRepresentativeA { set; get; }
        [Required(ErrorMessage = "Email người đại diện bên B không được để trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email người đại diện bên B không đúng định dạng")]
        public string EmailRepresentativeB { set; get; }
        [Required(ErrorMessage = "Tên người đại diện bên B không được để trống")]
        public string RepresentativeNameB { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện bên B không được để trống")]
        public string PositionRepresentativeB { set; get; }
        [Required(ErrorMessage = "Địa chỉ công ty không được để trống")]
        public string Address { set; get; }
        public string ContractNumber { set; get; }
        [Required(ErrorMessage = "Điều khoản không được để trống")]
        [DataType(DataType.Html, ErrorMessage = "Điều khoản không đúng định dạng")]
        public string ContentRule { set; get; }
        [Required(ErrorMessage = "Ngày bắt đầu hợp đồng không được để trống")]
        [DataType(DataType.DateTime, ErrorMessage = "Ngày bắt đầu phải là dạng ngày tháng")]
        [DateGreaterThan("EndDate", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu")]
        public DateTime StartDate { set; get; }
        [Required(ErrorMessage = "Ngày kết thúc hợp đồng không được để trống")]
        [DataType(DataType.DateTime, ErrorMessage = "Ngày kết thúc phải là dạng ngày tháng")]
        public DateTime EndDate { get; set; }
        public Status Status { set; get; }
        public DateTime CreatedDate { get; set; }
        public string ReasonEnd { get; set; }
        public int CompanyId { set; get; }
        [Required(ErrorMessage = "Giá hợp đồng không được để trống")]
        [Range(0.000000000001,double.MaxValue,ErrorMessage ="Giá trị giá phải lớn hơn 0")]
        public decimal PriceContract { get; set; }
        [Required(ErrorMessage = "Tên công ty không được để trống")]
        public string CompanyName { set; get; }
        [Required(ErrorMessage = "Số nhân viên tối đa không được để trống")]
        [Range(0.000000000001, double.MaxValue, ErrorMessage = "Số nhân viên tối đa phải lớn hơn 0")]
        public int MaxEmployee { get; set; }
    }
}
