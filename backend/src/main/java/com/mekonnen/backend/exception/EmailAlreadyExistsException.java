package com.mekonnen.backend.exception;

public class EmailAlreadyExistsException extends RuntimeException{

    // Thrown when a user tries to register with an email that already exists.
    public EmailAlreadyExistsException(String message){
        super(message);
    }
}
