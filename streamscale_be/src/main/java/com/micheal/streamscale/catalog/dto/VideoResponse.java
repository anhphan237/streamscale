package com.micheal.streamscale.catalog.dto;

import java.util.List;

public record VideoResponse(
        Long id,
        String title,
        String description,
        String type,
        String status,
        String thumbnailUrl,
        String trailerUrl,
        Integer durationSeconds,
        Integer releaseYear,
        String originalFileUrl,
        String originalFileName,
        Long originalFileSize,
        List<GenreResponse> genres
) {
}
