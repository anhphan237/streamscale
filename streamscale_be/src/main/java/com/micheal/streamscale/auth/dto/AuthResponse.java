package com.micheal.streamscale.auth.dto;

public record AuthResponse(
        String accessToken,
        UserInfo user
) {
    public record UserInfo(
            Long id,
            String email,
            String role
    ) {
    }
}
