package com.mekonnen.backend.exception;

public class InvalidCredentialsException extends RuntimeException{

    // Thrown when login credentials are invalid

    public InvalidCredentialsException(String message){
        super(message);
    }
}
