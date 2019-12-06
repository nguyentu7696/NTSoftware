using NTSoftware.Core.Shared.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Service.Interface.ViewModels
{
    public class ProjectDetailViewModel
    {

        public int Id { get; set; }
        [Required(ErrorMessage = "Tên dự án không được trống không hợp lệ")]
        public string ProjectName { set; get; }
        [Required(ErrorMessage = "Mô tả dự án không được trống không hợp lệ")]
        public string Description { set; get; }
        [Required(ErrorMessage = "Ngày bắt đầu hợp đồng không được để trống")]
        [DateGreaterThan("EndDate", ErrorMessage = "Ngày kết thúc phải lớn hơn ngày bắt đầu")]
        [DataType(DataType.DateTime, ErrorMessage = "Ngày bắt đầu dự án phải là dạng date time")]
        public DateTime StartDate { set; get; }
        [Required(ErrorMessage = "Ngày kết thúc dự án không được để trống")]
        [DataType(DataType.DateTime,ErrorMessage ="Ngày kết thúc dự án phải là dạng date time")]
        public DateTime? EndDate { set; get; }
        public int CompanyId { set; get; }
        public string ManagerName { get; set; }
        public int ManagerId { set; get; }
        public List<int> lstEmployee { get; set; }
    }
}
