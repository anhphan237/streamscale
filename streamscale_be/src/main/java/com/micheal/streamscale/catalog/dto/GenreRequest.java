package com.micheal.streamscale.catalog.dto;

import jakarta.validation.constraints.NotBlank;

public record GenreRequest(
        @NotBlank(message = "Genre name is required")
        String name
) {
}
