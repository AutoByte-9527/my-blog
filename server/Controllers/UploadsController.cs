using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/upload")]
public class UploadsController : ControllerBase
{
    private readonly FileService _fileService;

    public UploadsController(FileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            var url = await _fileService.UploadImageAsync(file);
            if (url == null)
            {
                return BadRequest(new { message = "No file provided" });
            }
            return Ok(new { url });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
