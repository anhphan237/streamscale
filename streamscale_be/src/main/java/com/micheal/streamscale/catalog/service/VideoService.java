package com.micheal.streamscale.catalog.service;

import com.micheal.streamscale.catalog.dto.GenreResponse;
import com.micheal.streamscale.catalog.dto.VideoCreateRequest;
import com.micheal.streamscale.catalog.dto.VideoResponse;
import com.micheal.streamscale.catalog.dto.VideoUpdateRequest;
import com.micheal.streamscale.catalog.entity.Genre;
import com.micheal.streamscale.catalog.entity.Video;
import com.micheal.streamscale.catalog.entity.VideoStatus;
import com.micheal.streamscale.catalog.entity.VideoType;
import com.micheal.streamscale.catalog.repository.GenreRepository;
import com.micheal.streamscale.catalog.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final GenreRepository genreRepository;

    @Transactional
    public VideoResponse create(VideoCreateRequest request) {
        Set<Genre> genres = getGenresByIds(request.genreIds());

        Video video = Video.builder()
                .title(request.title())
                .description(request.description())
                .type(VideoType.valueOf(request.type()))
                .status(VideoStatus.valueOf(request.status()))
                .thumbnailUrl(request.thumbnailUrl())
                .trailerUrl(request.trailerUrl())
                .durationSeconds(request.durationSeconds())
                .releaseYear(request.releaseYear())
                .genres(genres)
                .build();

        return toResponse(videoRepository.save(video));
    }

    @Transactional
    public VideoResponse update(Long id, VideoUpdateRequest request) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (request.title() != null) video.setTitle(request.title());
        if (request.description() != null) video.setDescription(request.description());
        if (request.type() != null) video.setType(VideoType.valueOf(request.type()));
        if (request.status() != null) video.setStatus(VideoStatus.valueOf(request.status()));
        if (request.thumbnailUrl() != null) video.setThumbnailUrl(request.thumbnailUrl());
        if (request.trailerUrl() != null) video.setTrailerUrl(request.trailerUrl());
        if (request.durationSeconds() != null) video.setDurationSeconds(request.durationSeconds());
        if (request.releaseYear() != null) video.setReleaseYear(request.releaseYear());

        if (request.genreIds() != null) {
            video.setGenres(getGenresByIds(request.genreIds()));
        }

        return toResponse(videoRepository.save(video));
    }

    @Transactional
    public void delete(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        videoRepository.delete(video);
    }

    @Transactional(readOnly = true)
    public VideoResponse getByIdForAdmin(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        return toResponse(video);
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getAllForAdmin() {
        return videoRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getPublishedVideos() {
        return videoRepository.findByStatusOrderByCreatedAtDesc(VideoStatus.PUBLISHED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VideoResponse getPublishedVideoDetail(Long id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (video.getStatus() != VideoStatus.PUBLISHED) {
            throw new RuntimeException("Video not found");
        }

        return toResponse(video);
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getLatest() {
        return videoRepository.findTop10ByStatusOrderByCreatedAtDesc(VideoStatus.PUBLISHED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<VideoResponse> getTrending() {
        return videoRepository.findTop10ByStatusOrderByReleaseYearDesc(VideoStatus.PUBLISHED)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Set<Genre> getGenresByIds(List<Long> genreIds) {
        if (genreIds == null || genreIds.isEmpty()) {
            return new HashSet<>();
        }

        return new HashSet<>(genreRepository.findAllById(genreIds));
    }

    private VideoResponse toResponse(Video video) {
        List<GenreResponse> genres = video.getGenres()
                .stream()
                .map(genre -> new GenreResponse(genre.getId(), genre.getName()))
                .toList();

        return new VideoResponse(
                video.getId(),
                video.getTitle(),
                video.getDescription(),
                video.getType().name(),
                video.getStatus().name(),
                video.getThumbnailUrl(),
                video.getTrailerUrl(),
                video.getDurationSeconds(),
                video.getReleaseYear(),
                genres
        );
    }
}