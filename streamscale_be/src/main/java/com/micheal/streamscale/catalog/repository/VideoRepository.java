package com.micheal.streamscale.catalog.repository;

import com.micheal.streamscale.catalog.entity.Video;
import com.micheal.streamscale.catalog.entity.VideoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {

    List<Video> findByStatusOrderByCreatedAtDesc(VideoStatus status);

    List<Video> findTop10ByStatusOrderByCreatedAtDesc(VideoStatus status);

    List<Video> findTop10ByStatusOrderByReleaseYearDesc(VideoStatus status);
}
