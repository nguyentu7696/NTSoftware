using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class EmployeeFullViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="Địa chỉ mail người đại diện bên A không được trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string EmailRepresentativeA { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện bên A không được trống")]
        public string RepresentativeNameA { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện bên A không được trống")]
        public string PositionRepresentativeA { set; get; }
        [Required(ErrorMessage = "Địa chỉ mail bên B không được trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string EmailRepresentativeB { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện bên B không được trống")]
        public string RepresentativeNameB { set; get; }
        [Required(ErrorMessage = "Nội dung hợp đồng không được trống")]
        public string ContentRule { get; set; }
        public int EmployeeId { set; get; }
        [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
        [DataType(DataType.DateTime, ErrorMessage = "Ngày bắt đầu phải là dạng ngày tháng")]
        [DateGreaterThan("EndDate", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu")]
        public DateTime StrartDate { get; set; }
        [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
        [DataType(DataType.DateTime, ErrorMessage = "Ngày kết thúc phải là dạng ngày tháng")]
        public DateTime EndDate { get; set; }
        public Status Status { get; set; }
        public int CompanyId { set; get; }
        [Required(ErrorMessage = "Lương nhân viên không được để trống")]
        [Range(1, double.MaxValue, ErrorMessage = "Giá trị giá phải lớn hơn 0")]
        public decimal SalaryContract { get; set; }
        public EmployeeViewModel EmployeeViewModel { get; set; }
    }
}
