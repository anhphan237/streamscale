package com.micheal.streamscale.auth.service;

import com.micheal.streamscale.auth.dto.AuthResponse;
import com.micheal.streamscale.auth.dto.LoginRequest;
import com.micheal.streamscale.auth.dto.MeResponse;
import com.micheal.streamscale.auth.dto.RegisterRequest;
import com.micheal.streamscale.auth.entity.Role;
import com.micheal.streamscale.auth.entity.User;
import com.micheal.streamscale.auth.entity.UserStatus;
import com.micheal.streamscale.auth.repository.UserRepository;
import com.micheal.streamscale.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return toAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return toAuthResponse(user, token);
    }

    public MeResponse me() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                )
        );
    }
}
