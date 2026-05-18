package com.micheal.streamscale.profile.dto;

public record ProfileResponse(
        Long id,
        String name,
        String avatarUrl,
        boolean isKids
) {
}