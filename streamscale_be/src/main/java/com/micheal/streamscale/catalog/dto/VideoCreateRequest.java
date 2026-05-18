package com.micheal.streamscale.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record VideoCreateRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotNull(message = "Video type is required")
        String type,

        @NotNull(message = "Video status is required")
        String status,

        String thumbnailUrl,

        String trailerUrl,

        Integer durationSeconds,

        Integer releaseYear,

        List<Long> genreIds
) {
}
