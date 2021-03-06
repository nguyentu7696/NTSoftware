﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class CompanyDetailViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Email công ty không được để trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }
        [Required(ErrorMessage ="Tên công ty không được trống")]
        public string CompanyName { set; get; }
        [Required(ErrorMessage = "Số điện thoại công ty không được trống")]
        [RegularExpression("^(08|09|03|07)[0|1|2|3|4|5|6|7|8|9]+[0-9]{6,8}$", ErrorMessage = "Số điện thoại công ty không đúng định dạng")]
        public string PhoneNumber { set; get; }
        public string Logo { set; get; }
        public string CompanyCode { get; set; }
        [Required(ErrorMessage = "Email người đại diện không được trống")]
        [RegularExpression(@"^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$", ErrorMessage = "Email người đại diện không đúng định dạng")]
        public string EmailRepresentative { set; get; }
        [Required(ErrorMessage = "Tên người đại diện không được trống")]
        public string RepresentativeName { set; get; }
        [Required(ErrorMessage = "Vị trí người đại diện không được trống")]
        public string PositionRepresentative { set; get; }
        [Required(ErrorMessage = "Địa chỉ không được trống")]
        public string Address { set; get; }
        public string ContractNumber { get; set; }
        public int ContractId { get; set; }
    }
}
