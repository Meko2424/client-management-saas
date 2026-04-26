package com.mekonnen.backend.exception;

// Thrown when a requested record does not exist
// or does not belong to the logged-in user.

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }


}
