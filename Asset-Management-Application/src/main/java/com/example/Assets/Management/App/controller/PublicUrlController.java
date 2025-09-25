package com.example.Assets.Management.App.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/")
@Tag(name = "public", description = "Public APIs")
public class PublicUrlController {

    @GetMapping
    public Object publicApi(){
        return "ASM Project Application is running";
    }
}
