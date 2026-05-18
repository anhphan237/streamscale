package com.micheal.streamscale.auth.dto;

public record MeResponse(
        Long id,
        String email,
        String role
) {
}
