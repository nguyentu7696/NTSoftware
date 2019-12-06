using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Enum;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NTSoftware.Repository
{
    public class DBInitializer
    {
        public static void SeedAsync( AppDbContext ctx)
        {
            if (ctx.Set<AppUser>().Where(x => x.UserName == "lhngoc2497@gmail.com").SingleOrDefault() == null)
            {
                AppUser user = new AppUser
                {
                    UserName = "lhngoc2497@gmail.com",
                    UserType = Roles.AdminNT,
                    Position = "CEO",
                    CompanyId = 0,
                    Password = PasswordHash.HashPassword("Ngoc@12345"),
                };
                ctx.Set<AppUser>().Add(user);
                ctx.SaveChanges();
                DetailUser detailUser = new DetailUser
                {
                    Address = "Hà Nội",
                    Birthday = DateTime.Now,
                    Gender = Gender.Male,
                    Id = user.Id,
                    Name = "Admin",
                    PhoneNumber = "0987654321",
                    IdentityCard = "017477593",
                    EmployeeKey = "ADMIN",
                };
                ctx.Set<DetailUser>().Add(detailUser);
                ctx.SaveChanges();
            }
        }
    }
}
