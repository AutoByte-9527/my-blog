using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.DTOs.Tag;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/tags")]
public class TagsAdminController : ControllerBase
{
    private readonly TagAdminService _tagAdminService;

    public TagsAdminController(TagAdminService tagAdminService)
    {
        _tagAdminService = tagAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTags()
    {
        var tags = await _tagAdminService.GetTagsAsync();
        return Ok(tags);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTag([FromBody] CreateTagRequest request)
    {
        if (string.IsNullOrEmpty(request.Name))
        {
            return BadRequest(new { message = "Name is required" });
        }

        var tag = await _tagAdminService.CreateTagAsync(request);
        return CreatedAtAction(nameof(GetTags), tag);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTag(int id, [FromBody] UpdateTagRequest request)
    {
        var tag = await _tagAdminService.UpdateTagAsync(id, request);
        if (tag == null)
        {
            return NotFound(new { message = "Tag not found" });
        }
        return Ok(tag);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(int id)
    {
        var result = await _tagAdminService.DeleteTagAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Tag not found" });
        }
        return NoContent();
    }
}
