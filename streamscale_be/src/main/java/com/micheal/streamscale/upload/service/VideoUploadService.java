package com.micheal.streamscale.upload.service;

import com.micheal.streamscale.catalog.entity.Video;
import com.micheal.streamscale.catalog.entity.VideoStatus;
import com.micheal.streamscale.catalog.entity.VideoType;
import com.micheal.streamscale.catalog.repository.VideoRepository;
import com.micheal.streamscale.storage.service.StorageService;
import com.micheal.streamscale.upload.dto.VideoUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class VideoUploadService {

    private final VideoRepository videoRepository;
    private final StorageService storageService;

    @Transactional
    public VideoUploadResponse uploadVideo(
            String title,
            String description,
            String type,
            Integer releaseYear,
            Integer durationSeconds,
            MultipartFile file
    ) {
        validateFile(file);

        Video video = Video.builder()
                .title(title)
                .description(description)
                .type(VideoType.valueOf(type))
                .status(VideoStatus.DRAFT)
                .releaseYear(releaseYear)
                .durationSeconds(durationSeconds)
                .build();

        Video savedVideo = videoRepository.save(video);

        String originalFileUrl = storageService.uploadVideo(file, savedVideo.getId());

        savedVideo.setStatus(VideoStatus.UPLOADED);
        savedVideo.setOriginalFileUrl(originalFileUrl);
        savedVideo.setOriginalFileName(file.getOriginalFilename());
        savedVideo.setOriginalContentType(file.getContentType());
        savedVideo.setOriginalFileSize(file.getSize());

        Video updatedVideo = videoRepository.save(savedVideo);

        return new VideoUploadResponse(
                updatedVideo.getId(),
                updatedVideo.getTitle(),
                updatedVideo.getStatus().name(),
                updatedVideo.getOriginalFileUrl(),
                updatedVideo.getOriginalFileName(),
                updatedVideo.getOriginalFileSize()
        );
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Video file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("video/mp4")) {
            throw new IllegalArgumentException("Only MP4 video is supported in Phase 2");
        }
    }
}
