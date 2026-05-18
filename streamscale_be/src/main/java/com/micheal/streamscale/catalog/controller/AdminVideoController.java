package com.micheal.streamscale.catalog.controller;

import com.micheal.streamscale.catalog.dto.VideoCreateRequest;
import com.micheal.streamscale.catalog.dto.VideoResponse;
import com.micheal.streamscale.catalog.dto.VideoUpdateRequest;
import com.micheal.streamscale.catalog.service.VideoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/videos")
@RequiredArgsConstructor
public class AdminVideoController {

    private final VideoService videoService;

    @GetMapping
    public List<VideoResponse> getAll() {
        return videoService.getAllForAdmin();
    }

    @GetMapping("/{id}")
    public VideoResponse getById(@PathVariable Long id) {
        return videoService.getByIdForAdmin(id);
    }

    @PostMapping
    public VideoResponse create(@Valid @RequestBody VideoCreateRequest request) {
        return videoService.create(request);
    }

    @PutMapping("/{id}")
    public VideoResponse update(
            @PathVariable Long id,
            @RequestBody VideoUpdateRequest request
    ) {
        return videoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        videoService.delete(id);
    }
}
