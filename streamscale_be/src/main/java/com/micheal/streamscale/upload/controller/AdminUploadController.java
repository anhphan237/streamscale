package com.micheal.streamscale.upload.controller;

import com.micheal.streamscale.upload.dto.VideoUploadResponse;
import com.micheal.streamscale.upload.service.VideoUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class AdminUploadController {

    private final VideoUploadService videoUploadService;

    @PostMapping("/videos")
    public VideoUploadResponse uploadVideo(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String type,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) Integer durationSeconds,
            @RequestParam MultipartFile file
    ) {
        return videoUploadService.uploadVideo(
                title,
                description,
                type,
                releaseYear,
                durationSeconds,
                file
        );
    }
}
