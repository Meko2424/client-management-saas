package com.mekonnen.backend.security;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// This class maps values from application.yml under app.jwt
@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {

    // Secret key used to sign JWTs
    private String secret;

    // Expiration time in millisecond
    private long expirationMs;
}
