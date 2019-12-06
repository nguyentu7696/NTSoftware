using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class UserAdminViewModel
    {
        [Required(ErrorMessage ="user Id không được trống")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Tên không được trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Số điện thoại không được trống")]
        [RegularExpression("^(08|09|03|07)[0|1|2|3|4|5|6|7|8|9]+[0-9]{6,8}$", ErrorMessage = "Số điện thoại người dùng không đúng định dạng")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Ngày sinh không được trống")]
        public DateTime Birthday { get; set; }
        [Required(ErrorMessage = "Địa chỉ không được trống")]
        public string Address { get; set; }
        [Required(ErrorMessage = "Email không được trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }
        [RequiredEnumAttribute(ErrorMessage = "Giới tính không hợp lệ")]
        public Gender Gender { get; set; }
        [Required(ErrorMessage = "Chức vụ không được trống")]
        public string Position { get; set; }
    }
}
