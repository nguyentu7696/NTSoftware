using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Identity;
using NTSoftware.Core.Models.Models.NTSoftware.Core.Models.Models;
using NTSoftware.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace NTSoftware.Repository.Repository
{
    public class UserRepository : NTRepository<AppUser, int>, IUserRepository
    {
        private AppDbContext _appContext;
        private Random random;
        public UserRepository(AppDbContext context) : base(context)
        {
            _appContext = context;
            random = new Random();
        }

        public AppUser CreateAsync(AppUser entity, string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }
            string hashed = PasswordHash.HashPassword(password);
            entity.Password = hashed;
            Add(entity);
            Commit();
            return entity;
        }
        public string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public string CreateTokenChangePassword(AppUser user)
        {
            var timeSpan = DateTime.Now;
            var randomString = RandomString(35);
            return Base64Encode(randomString + "-" + timeSpan.ToString());
        }

        public AppUser GetByUserName(string userName)
        {
            var user = FindAll(x => x.UserName == userName).SingleOrDefault();
            return user;
        }
        public string Base64Encode(string plainText)
        {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public string Base64Decode(string base64EncodedData)
        {
            var base64EncodedBytes = System.Convert.FromBase64String(base64EncodedData);
            return System.Text.Encoding.UTF8.GetString(base64EncodedBytes);
        }
        public bool CheckTokenChangePassword(AppUser user, string token)
        {
            if (user == null || user.TokenReset == null || token == null || token != user.TokenReset)
            {
                return false;
            }
            string decodeTokenUser = Base64Decode(user.TokenReset);

            var decodeLstUser = decodeTokenUser.Split('-');
            DateTime timeDecodeToken;
            if (decodeLstUser.Count() != 2 || !DateTime.TryParse(decodeLstUser[1], out timeDecodeToken))
            {
                return false;
            }
            timeDecodeToken = DateTime.Parse(decodeLstUser[1]);
            if ((DateTime.Now - timeDecodeToken).TotalSeconds > 300)
            {
                return false;
            }
            return true;
        }
    }
}
