package com.micheal.streamscale.storage.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String uploadVideo(MultipartFile file, Long videoId);
}
