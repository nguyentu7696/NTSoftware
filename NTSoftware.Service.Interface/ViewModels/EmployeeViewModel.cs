using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class EmployeeViewModel
    {
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Số điện thoại người dùng không được để trống")]
        [RegularExpression("^(08|09|03|07)[0|1|2|3|4|5|6|7|8|9]+[0-9]{6,8}$", ErrorMessage = "Số điện thoại người dùng không đúng định dạng")]
        public string PhoneNumber { get; set; } 
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])(?!.*['']).{8,}$", ErrorMessage = "Mật khẩu phải từ 8 ký tự gồm ký tự hoa, thường, đặc biệt")]
        public string Password { get; set; }
        public string Position { get; set; }
        public int CompanyId { get; set; }
        public int Id { get; set; }
        public Status Status { get; set; }
        public Roles UserType { get; set; }
        [Required(ErrorMessage = "Tên người dùng không được để trống")]
        public string Name { set; get; }
        public string EmployeeKey { get; set; }
        [Required(ErrorMessage = "Số chứng minh nhân dân không được để trống")]
        public string IdentityCard { set; get; }
        [RequiredEnumAttribute(ErrorMessage = "Giới tính không hợp lệ")]
        public Gender Gender { set; get; }
        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        [YearOldsCanWork("Gender", ErrorMessage ="Độ tuổi lao động không đúng (Nam: 15 - 60, Nữ: 15 - 55)")]
        public DateTime Birthday { set; get; }
        
        [Required(ErrorMessage = "Địa chỉ người dùng không được để trống")]
        public string Address { set; get; }
    }
}
