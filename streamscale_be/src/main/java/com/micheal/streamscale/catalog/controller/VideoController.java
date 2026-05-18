package com.micheal.streamscale.catalog.controller;

import com.micheal.streamscale.catalog.dto.VideoResponse;
import com.micheal.streamscale.catalog.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping
    public List<VideoResponse> getVideos() {
        return videoService.getPublishedVideos();
    }

    @GetMapping("/{id}")
    public VideoResponse getVideoDetail(@PathVariable Long id) {
        return videoService.getPublishedVideoDetail(id);
    }

    @GetMapping("/latest")
    public List<VideoResponse> getLatest() {
        return videoService.getLatest();
    }

    @GetMapping("/trending")
    public List<VideoResponse> getTrending() {
        return videoService.getTrending();
    }
}
