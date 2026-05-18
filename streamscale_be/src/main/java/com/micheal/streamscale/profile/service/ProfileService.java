package com.micheal.streamscale.profile.service;

import com.micheal.streamscale.auth.entity.User;
import com.micheal.streamscale.auth.repository.UserRepository;
import com.micheal.streamscale.profile.dto.ProfileRequest;
import com.micheal.streamscale.profile.dto.ProfileResponse;
import com.micheal.streamscale.profile.entity.Profile;
import com.micheal.streamscale.profile.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public List<ProfileResponse> getMyProfiles() {
        User currentUser = getCurrentUser();

        return profileRepository.findByUserId(currentUser.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProfileResponse create(ProfileRequest request) {
        User currentUser = getCurrentUser();

        Profile profile = Profile.builder()
                .user(currentUser)
                .name(request.name())
                .avatarUrl(request.avatarUrl())
                .isKids(request.isKids())
                .build();

        return toResponse(profileRepository.save(profile));
    }

    public ProfileResponse update(Long profileId, ProfileRequest request) {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByIdAndUserId(profileId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setName(request.name());
        profile.setAvatarUrl(request.avatarUrl());
        profile.setKids(request.isKids());

        return toResponse(profileRepository.save(profile));
    }

    public void delete(Long profileId) {
        User currentUser = getCurrentUser();

        Profile profile = profileRepository.findByIdAndUserId(profileId, currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profileRepository.delete(profile);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getAvatarUrl(),
                profile.isKids()
        );
    }
}
