package com.example.Assets.Management.App.component;

import org.springframework.stereotype.Component;

import com.google.api.client.util.Value;

import jakarta.annotation.PostConstruct;

@Component
public class EnvCheck {

    @Value("${SPRING_DATASOURCE_URL:NOT_FOUND}")
    private String datasourceUrl;

    @Value("${jwt.secret:NOT_FOUND}")
    private String jwtSecret;

    @PostConstruct
    public void printEnv() {
        System.out.println("====== ENV CHECK ======");
        System.out.println("Datasource URL: " + datasourceUrl);
        System.out.println("JWT Secret: " + jwtSecret);
        System.out.println("=======================");
    }
}
