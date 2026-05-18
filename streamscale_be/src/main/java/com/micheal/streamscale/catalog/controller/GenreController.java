package com.micheal.streamscale.catalog.controller;

import com.micheal.streamscale.catalog.dto.GenreResponse;
import com.micheal.streamscale.catalog.service.GenreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@RequiredArgsConstructor
public class GenreController {

    private final GenreService genreService;

    @GetMapping
    public List<GenreResponse> getAll() {
        return genreService.getAll();
    }
}
