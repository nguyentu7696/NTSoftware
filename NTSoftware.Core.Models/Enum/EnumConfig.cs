﻿using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Core.Models.Enum
{
    public enum Gender
    {

        [Display(Name = "Nữ")] FeMale = 0,
        [Display(Name = "Nam")] Male = 1
    }
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Status
    {
        [Display(Name = "Active")] Active = 1,
        [Display(Name = "New")] New = 2,
        [Display(Name = "Expired")] Expired = 3,
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum Roles
    {
        [Display(Name = "AdminNT")] AdminNT = 1,
        [Display(Name = "AdminCompany")] AdminCompany = 2,
        [Display(Name = "Employee")] Employee = 3,
        [Display(Name = "Manager")] Manager = 4,
    }
    public enum StatusTask
    {
        [Display(Name = "New")] AdminNT = 1,
        [Display(Name = "Running")] AdminCompany = 2,
        [Display(Name = "Done")] Employee = 3,
    }
}
