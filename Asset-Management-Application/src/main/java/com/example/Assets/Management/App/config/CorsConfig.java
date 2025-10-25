package com.example.Assets.Management.App.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


@Configuration
public class CorsConfig {
    // Inject the environment variable value. 
    // The defaultValue is a comma-separated string that will be used 
    // if the environment variable is not set.
    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://172.27.236.104:3000,https://asm-project.onrender.com,https://ams-gloitel.netlify.app}")
    private String allowedOriginsString;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Split the comma-separated string into a List of origins
        List<String> allowedOrigins = Arrays.asList(allowedOriginsString.split(","));
        
        // Add all origins from the environment variable
        config.setAllowedOrigins(allowedOrigins);

        // The rest of your configuration remains the same
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
