package com.micheal.streamscale.upload.dto;

public record VideoUploadResponse(
        Long videoId,
        String title,
        String status,
        String originalFileUrl,
        String originalFileName,
        Long originalFileSize
) {
}
