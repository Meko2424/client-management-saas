package com.mekonnen.backend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// This class configures CORS for the backend API.
// CORS allows the Next.js frontend on localhost:3000
// to call the Spring Boot backend on localhost:8080.
@Configuration
public class CorsConfig {
    // This bean customizes Spring MVC CORS settings.
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            // This method tells Spring which frontend origins can call the API.
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        // Apply this CORS rule to all backend endpoints.
                        .addMapping("/**")

                        // Allow the local Next.js frontend.
                        .allowedOrigins("http://localhost:3000")

                        // Allow common HTTP methods used by our API.
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")

                        // Allow all request headers, including Authorization.
                        .allowedHeaders("*")

                        // Allow browser credentials if needed later.
                        .allowCredentials(true);
            }
        };
    }
}
