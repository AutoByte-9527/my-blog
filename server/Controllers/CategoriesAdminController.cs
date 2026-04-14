using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Api.DTOs.Category;
using MyBlog.Api.Services;

namespace MyBlog.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/admin/categories")]
public class CategoriesAdminController : ControllerBase
{
    private readonly CategoryAdminService _categoryAdminService;

    public CategoriesAdminController(CategoryAdminService categoryAdminService)
    {
        _categoryAdminService = categoryAdminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryAdminService.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
    {
        if (string.IsNullOrEmpty(request.Name))
        {
            return BadRequest(new { message = "Name is required" });
        }

        var category = await _categoryAdminService.CreateCategoryAsync(request);
        return CreatedAtAction(nameof(GetCategories), category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryRequest request)
    {
        var category = await _categoryAdminService.UpdateCategoryAsync(id, request);
        if (category == null)
        {
            return NotFound(new { message = "Category not found" });
        }
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var result = await _categoryAdminService.DeleteCategoryAsync(id);
        if (!result)
        {
            return NotFound(new { message = "Category not found" });
        }
        return NoContent();
    }
}
