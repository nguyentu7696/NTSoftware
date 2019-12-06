using NTSoftware.Core.Models.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace NTSoftware.Core.Shared.Helper
{
    [AttributeUsage(AttributeTargets.Property)]
    public class DateGreaterThanAttribute : ValidationAttribute
    {
        public DateGreaterThanAttribute(string dateToCompareToFieldName)
        {
            DateToCompareToFieldName = dateToCompareToFieldName;
        }

        private string DateToCompareToFieldName { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            DateTime earlierDate = (DateTime)value;

            DateTime laterDate = (DateTime)validationContext.ObjectType.GetProperty(DateToCompareToFieldName).GetValue(validationContext.ObjectInstance, null);

            if (laterDate > earlierDate)
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult(ErrorMessage);
            }
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class StatusCheck : ValidationAttribute
    {
        public StatusCheck(string enumToCompareToFieldName)
        {
            EnumToCompareToFieldName = enumToCompareToFieldName;
        }

        private string EnumToCompareToFieldName { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string valueCheck = value as string;
            Status laterDate = (Status)validationContext.ObjectType.GetProperty(EnumToCompareToFieldName).GetValue(validationContext.ObjectInstance, null);

            if (laterDate == Status.Active)
            {
                return ValidationResult.Success;
            }
            if (laterDate == Status.Expired)
            {
                if (string.IsNullOrEmpty(valueCheck) || string.IsNullOrWhiteSpace(valueCheck))
                {
                    return new ValidationResult(ErrorMessage);
                }
                else
                {
                    return ValidationResult.Success;
                }
            }
            else
            {
                return new ValidationResult(ErrorMessage);
            }
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class YearOldsCanWork : ValidationAttribute
    {
        public YearOldsCanWork(string dateToCompareToFieldName)
        {
            DateToCompareToFieldName = dateToCompareToFieldName;
        }

        private string DateToCompareToFieldName { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            DateTime inputDate = (DateTime)value;

            Gender gender = (Gender)validationContext.ObjectType.GetProperty(DateToCompareToFieldName).GetValue(validationContext.ObjectInstance, null);
            if (gender == Gender.Male)
            {
                if (inputDate.AddYears(15) <= DateTime.Now && inputDate.AddYears(65) >= DateTime.Now)
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult(ErrorMessage);
                }
            }
            else
            {
                if (inputDate.AddYears(15) <= DateTime.Now && inputDate.AddYears(55) >= DateTime.Now)
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult(ErrorMessage);
                }
            }
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class DateTypeAttribute : ValidationAttribute
    {
        public DateTypeAttribute(Type type)
        {
            typeValid = type;
        }

        private Type typeValid { get; set; }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            Type typeValue = value.GetType();

            if (typeValue == typeValid)
            {
                return ValidationResult.Success;
            }
            else
            {
                return new ValidationResult(ErrorMessage);
            }
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class RequiredEnumAttribute : RequiredAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null) return false;
            var type = value.GetType();
            return type.IsEnum && Enum.IsDefined(type, value);
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class EnumWithoutNew : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            Status status = (Status)value;
            if (status == Status.New)
            {
                return new ValidationResult(ErrorMessage);
            }
            return ValidationResult.Success;
        }
    }

}
