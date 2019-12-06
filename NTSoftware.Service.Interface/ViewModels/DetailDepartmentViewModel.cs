using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class DetailDepartmentViewModel
    {
        public DetailDepartmentViewModel()
        {

        }

        public int Id { get; set; }
        [Required(ErrorMessage ="Tên phòng ban không được trống")]
        public string DepartmentName { set; get; }
        [Required(ErrorMessage = "Số điện thoại phòng không được trống")]
        [RegularExpression("^(08|09|03|07)[0|1|2|3|4|5|6|7|8|9]+[0-9]{6,8}$", ErrorMessage = "Số điện thoại công ty không đúng định dạng")]
        public string PhoneNumber { set; get; }
        [Required(ErrorMessage = "Email không được trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string Email { set; get; }
        [Required(ErrorMessage = "Địa chỉ không được trống")]
        public string Address { set; get; }
        [Required(ErrorMessage = "Mô tả phòng ban không được trống")]
        public string Description { set; get; }
        public int ManagerId { set; get; }
        public int CompanyId { set; get; }
        public List<int> lstEmployee { get; set; }
    }
}
