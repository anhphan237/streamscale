package com.micheal.streamscale.profile.controller;

import com.micheal.streamscale.profile.dto.ProfileRequest;
import com.micheal.streamscale.profile.dto.ProfileResponse;
import com.micheal.streamscale.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public List<ProfileResponse> getMyProfiles() {
        return profileService.getMyProfiles();
    }

    @PostMapping
    public ProfileResponse create(@Valid @RequestBody ProfileRequest request) {
        return profileService.create(request);
    }

    @PutMapping("/{id}")
    public ProfileResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ProfileRequest request
    ) {
        return profileService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        profileService.delete(id);
    }
}