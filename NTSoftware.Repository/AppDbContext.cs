using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NTSoftware.Core.Models.Models;
using NTSoftware.Core.Models.Models.Interface;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Core.Shared.Constants;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NTSoftware.Repository
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        { }
        public int CurrentUserId { get; set; }
        public DbSet<DetailUser> DetailUser { set; get; }
        public DbSet<AppUser> User { get; set; }
        public DbSet<Option> Option { get; set; }
        public DbSet<CompanyDetail> CompanyDetail { set; get; }
        public DbSet<ContractCompany> ContractCompany { set; get; }
        public DbSet<Department> Department { set; get; }
        public DbSet<EmployeeContract> EmployeeContract { set; get; }
        public DbSet<EmployeeProject> EmployeeProject { set; get; }
        public DbSet<Project> Project { set; get; }
        public DbSet<Function> Function { set; get; }
        public DbSet<Rule> Rule { set; get; }
        public DbSet<LogUsedTime> LogUsedTime { set; get; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            ///const string priceDecimalType = "decimal(18,2)";


            //builder.Entity<Company>().Property(r => r.RepresentativeId).HasColumnType("uniqueidentifier");
            //builder.Entity<Company>().Property(r => r.UpdatePersonID).HasColumnType("uniqueidentifier");

            builder.Entity<AppUser>().Property(r => r.UserType).HasColumnType("tinyint");
            builder.Entity<AppUser>().Property(r => r.Status).HasColumnType("tinyint");
            builder.Entity<DetailUser>().Property(r => r.Id).ValueGeneratedNever()
                   .HasAnnotation("DatabaseGenerated", DatabaseGeneratedOption.None);
            builder.Entity<ContractCompany>().Property(r => r.Status).HasColumnType("tinyint");
            builder.Entity<ContractCompany>().Property(r => r.ContentRule).HasColumnType("ntext");
            builder.Entity<ContractCompany>().Property(r => r.IsBreak).HasDefaultValue(false);
            builder.Entity<EmployeeContract>().Property(r => r.Status).HasColumnType("tinyint");
            builder.Entity<EmployeeContract>().Property(r => r.ContentRule).HasColumnType("ntext");
            //builder.Entity<ContractCompany>().Property(r => r.UpdatePersonId).HasColumnType("uniqueidentifier");
            //builder.Entity<EmployeeContract>().Property(r => r.UpdatePersonId).HasColumnType("uniqueidentifier");
            builder.Entity<Rule>().Property(r => r.Content).HasColumnType("ntext");
            builder.Entity<DetailUser>().Property(r => r.PhoneNumber).HasColumnType("varchar(15)");
            builder.Entity<CompanyDetail>().Property(r => r.PhoneNumber).HasColumnType("varchar(15)");
            builder.Entity<EmployeeProject>().HasKey(r => new { r.UserID, r.ProjectId });

        }
        public override int SaveChanges()
        {
            UpdateAuditEntities();
            return base.SaveChanges();
        }
        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            UpdateAuditEntities();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            UpdateAuditEntities();
            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }
        private void UpdateAuditEntities()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IDomainEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));


            foreach (var entry in modifiedEntries)
            {
                var entity = (IDomainEntity)entry.Entity;
                DateTime now = DateTime.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedDate = now;
                    entity.CreatedBy = CurrentUserId;
                    entity.DeleteFlag = StatusDelete.NON_DELETED;
                }
                else
                {
                    base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                    base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                }

                entity.UpdatedDate = now;
                entity.UpdatedBy = CurrentUserId;
            }
        }
    }
}
