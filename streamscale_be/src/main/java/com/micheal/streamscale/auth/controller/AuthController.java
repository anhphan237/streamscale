package com.micheal.streamscale.auth.controller;

import com.micheal.streamscale.auth.dto.AuthResponse;
import com.micheal.streamscale.auth.dto.LoginRequest;
import com.micheal.streamscale.auth.dto.MeResponse;
import com.micheal.streamscale.auth.dto.RegisterRequest;
import com.micheal.streamscale.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public MeResponse me() {
        return authService.me();
    }
}
