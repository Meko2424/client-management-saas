package com.mekonnen.backend.controller;

import com.mekonnen.backend.dto.client.ClientResponse;
import com.mekonnen.backend.dto.client.CreateClientRequest;
import com.mekonnen.backend.dto.client.UpdateClientRequest;
import com.mekonnen.backend.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller exposes client management API endpoints.
// All endpoints are protected by JWT because they are not under /api/auth.
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    // Create a new client for the logged-in user.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientResponse createClient(
            @Valid @RequestBody CreateClientRequest request,
            Authentication authentication
    ) {
        return clientService.createClient(request, authentication);
    }

    // Get all clients for the logged-in user.
    @GetMapping
    public List<ClientResponse> getClients(Authentication authentication) {
        return clientService.getClients(authentication);
    }

    // Get one client by ID.
    @GetMapping("/{id}")
    public ClientResponse getClientById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return clientService.getClientById(id, authentication);
    }

    // Update one client by ID.
    @PutMapping("/{id}")
    public ClientResponse updateClient(
            @PathVariable Long id,
            @Valid @RequestBody UpdateClientRequest request,
            Authentication authentication
    ) {
        return clientService.updateClient(id, request, authentication);
    }

    // Delete one client by ID.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteClient(
            @PathVariable Long id,
            Authentication authentication
    ) {
        clientService.deleteClient(id, authentication);
    }
}
