using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace NTSoftware.ViewModel.Auth
{
    public class LoginViewModel
    {
        [Required(ErrorMessage ="Tài khoản không được để trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email sai định dạng")]

        public string UserName { get; set; }
        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
