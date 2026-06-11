// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Threading.Tasks;
using algorithms_visualizer.Models.Users;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace algorithms_visualizer.Areas.Identity.Pages.Account.Manage
{
    public class IndexModel : PageModel
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IWebHostEnvironment _environment;

        private static readonly string[] AllowedExtensions = { ".png", ".jpg", ".jpeg", ".gif", ".webp" };
        private const long MaxFileSize = 2 * 1024 * 1024; // 2 MB

        public IndexModel(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _environment = environment;
        }

        public string Username { get; set; }

        public string CurrentAvatarPath { get; set; }

        [TempData]
        public string StatusMessage { get; set; }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [MaxLength(50)]
            [Display(Name = "Nickname")]
            public string Nickname { get; set; }

            [Display(Name = "Avatar")]
            public IFormFile AvatarFile { get; set; }
        }

        private async Task LoadAsync(AppUser user)
        {
            Username = await _userManager.GetUserNameAsync(user);
            CurrentAvatarPath = user.AvatarPath;

            Input = new InputModel
            {
                Nickname = user.Nickname
            };
        }

        public async Task<IActionResult> OnGetAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            await LoadAsync(user);
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{_userManager.GetUserId(User)}'.");
            }

            if (!ModelState.IsValid)
            {
                await LoadAsync(user);
                return Page();
            }

            // 1. Nickname
            if (Input.Nickname != user.Nickname)
            {
                user.Nickname = Input.Nickname;
            }

            // 2. Avatar upload
            if (Input.AvatarFile != null && Input.AvatarFile.Length > 0)
            {
                var extension = Path.GetExtension(Input.AvatarFile.FileName).ToLowerInvariant();

                if (Array.IndexOf(AllowedExtensions, extension) < 0)
                {
                    StatusMessage = "Error: only PNG, JPG, GIF or WEBP files are allowed.";
                    return RedirectToPage();
                }

                if (Input.AvatarFile.Length > MaxFileSize)
                {
                    StatusMessage = "Error: file is too large (max 2 MB).";
                    return RedirectToPage();
                }

                var fileName = $"{Guid.NewGuid()}{extension}";
                var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads", "avatars");
                Directory.CreateDirectory(uploadsDir);

                var filePath = Path.Combine(uploadsDir, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await Input.AvatarFile.CopyToAsync(stream);
                }

                // Remove old avatar file from disk
                if (!string.IsNullOrEmpty(user.AvatarPath))
                {
                    var oldFile = Path.Combine(_environment.WebRootPath, user.AvatarPath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFile))
                    {
                        System.IO.File.Delete(oldFile);
                    }
                }

                user.AvatarPath = $"/uploads/avatars/{fileName}";
            }

            var finalResult = await _userManager.UpdateAsync(user);
            if (!finalResult.Succeeded)
            {
                StatusMessage = "Unexpected error when saving profile.";
                return RedirectToPage();
            }

            await _signInManager.RefreshSignInAsync(user);
            StatusMessage = "Your profile has been updated";
            return RedirectToPage();
        }
    }
}
