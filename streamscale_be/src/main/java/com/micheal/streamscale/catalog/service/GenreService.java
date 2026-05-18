package com.micheal.streamscale.catalog.service;

import com.micheal.streamscale.catalog.dto.GenreRequest;
import com.micheal.streamscale.catalog.dto.GenreResponse;
import com.micheal.streamscale.catalog.entity.Genre;
import com.micheal.streamscale.catalog.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenreService {

    private final GenreRepository genreRepository;

    public GenreResponse create(GenreRequest request) {
        if (genreRepository.existsByNameIgnoreCase(request.name())) {
            throw new RuntimeException("Genre already exists");
        }

        Genre genre = Genre.builder()
                .name(request.name())
                .build();

        return toResponse(genreRepository.save(genre));
    }

    public List<GenreResponse> getAll() {
        return genreRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private GenreResponse toResponse(Genre genre) {
        return new GenreResponse(genre.getId(), genre.getName());
    }
}
