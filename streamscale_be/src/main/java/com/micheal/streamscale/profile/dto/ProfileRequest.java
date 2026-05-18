package com.micheal.streamscale.profile.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfileRequest(
        @NotBlank(message = "Profile name is required")
        String name,

        String avatarUrl,

        boolean isKids
) {
}