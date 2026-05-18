package com.micheal.streamscale.catalog.controller;

import com.micheal.streamscale.catalog.dto.GenreRequest;
import com.micheal.streamscale.catalog.dto.GenreResponse;
import com.micheal.streamscale.catalog.service.GenreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/genres")
@RequiredArgsConstructor
public class AdminGenreController {

    private final GenreService genreService;

    @PostMapping
    public GenreResponse create(@Valid @RequestBody GenreRequest request) {
        return genreService.create(request);
    }
}
