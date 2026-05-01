package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.client.ClientResponse;
import com.mekonnen.backend.dto.client.CreateClientRequest;
import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ClientServiceTest {

    @Test

    void createClient_shouldCreateClientForLoggedInUser(){

        // Create fake repository.
        ClientRepository clientRepository = Mockito.mock(ClientRepository.class);
        UserRepository userRepository = Mockito.mock(UserRepository.class);

        // Create the service we want to test
        ClientService clientService = new ClientService(clientRepository, userRepository);

        // Fake authentication user email
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");

        // Fake user from database
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFullName("Test User");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        // Fake request from frontend
        CreateClientRequest request = new CreateClientRequest();
        request.setName("Acme LLC");
        request.setEmail("contact@acme.com");
        request.setPhone("404-555-1234");
        request.setCompany("Acme");
        request.setNotes("Important client");

        // Fake saved client
        Client savedClient = new Client();
        savedClient.setId(10L);
        savedClient.setUser(user);
        savedClient.setName("Acme LLC");
        savedClient.setEmail("contact@acme.com");
        savedClient.setPhone("404-555-1234");
        savedClient.setCompany("Acme");
        savedClient.setNotes("Important client");

        when(clientRepository.save(any(Client.class)))
                .thenReturn(savedClient);

        // Run the method
        ClientResponse response = clientService.createClient(request, authentication);

        // Check result
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Acme LLC", response.getName());
        assertEquals("contact@acme.com", response.getEmail());

        // Verify save was called once
        verify(clientRepository, times(1)).save(any(Client.class));

    }

    @Test
    void createClient_shouldThrowExceptionWhenUserNotFound(){
        ClientRepository clientRepository = Mockito.mock(ClientRepository.class);
        UserRepository userRepository = Mockito.mock(UserRepository.class);

        ClientService clientService = new ClientService(clientRepository, userRepository);

        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getName()).thenReturn("missing@example.com");

        when(userRepository.findByEmail("missing@example.com"))
                .thenReturn(Optional.empty());

        CreateClientRequest request = new CreateClientRequest();
        request.setName("Acme LLC");

        assertThrows(
                RuntimeException.class,
                () -> clientService.createClient(request, authentication)
        );

        verify(clientRepository, never()).save(any(Client.class));
    }
}
