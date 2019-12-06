using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NTSoftware.Core.Shared;
using NTSoftware.Core.Shared.Constants;
using NTSoftware.Core.Shared.Dtos;

namespace NTSoftware.Controllers
{
    public class UploadController : BaseController
    {
        #region CONSTRUCTOR

        private IHostingEnvironment _hostingEnvironment;

        public UploadController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        #endregion CONSTRUCTOR
        [HttpPost, DisableRequestSizeLimit]
        [Route("ChangeLogoAdmin")]
        [Authorize(Roles = "AdminNT")]
        public IActionResult UploadFile(IFormFile formfile)
        {
            try
            {
                var file = Request.Form.Files[0];
                string folderName = "Resource";
                string webRootPath = _hostingEnvironment.WebRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                string fileName = "";
                if (file.Length > 0)
                {
                    fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, "default.png");
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                    return new OkObjectResult(new GenericResult($"{folderName}/{fileName}", true, ErrorMsg.SUCCEED, ErrorCode.SUCCEED_CODE));
                }

                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.UPLOAD_FAILED, ErrorCode.ERROR_CODE));
            }
            catch (Exception ex)
            {
                return new OkObjectResult(new GenericResult(null, false, ErrorMsg.ERROR_ON_HANDLE_DATA, ErrorCode.ERROR_HANDLE_DATA));
            }
        }
    }
}