package com.mekonnen.backend.service;


import com.mekonnen.backend.dto.client.ClientResponse;
import com.mekonnen.backend.dto.client.CreateClientRequest;
import com.mekonnen.backend.dto.client.UpdateClientRequest;
import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

// This service contains the business logic for client management.
@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientService(ClientRepository clientRepository,
                         UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    // Create a new client for the currently logged-in user.
    public ClientResponse createClient(CreateClientRequest request, Authentication authentication) {
        User user = getCurrentUser(authentication);

        Client client = new Client();
        client.setUser(user);
        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setCompany(request.getCompany());
        client.setNotes(request.getNotes());

        Client savedClient = clientRepository.save(client);

        return mapToResponse(savedClient);
    }

    // Return all clients owned by the currently logged-in user.
    public List<ClientResponse> getClients(Authentication authentication) {
        User user = getCurrentUser(authentication);

        return clientRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Return one client by ID, only if owned by the logged-in user.
    public ClientResponse getClientById(Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);

        Client client = clientRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        return mapToResponse(client);
    }

    // Update one client, only if owned by the logged-in user.
    public ClientResponse updateClient(Long id,
                                       UpdateClientRequest request,
                                       Authentication authentication) {
        User user = getCurrentUser(authentication);

        Client client = clientRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        client.setName(request.getName());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setCompany(request.getCompany());
        client.setNotes(request.getNotes());

        Client updatedClient = clientRepository.save(client);

        return mapToResponse(updatedClient);
    }

    // Delete one client, only if owned by the logged-in user.
    public void deleteClient(Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);

        Client client = clientRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        clientRepository.delete(client);
    }

    // Get the current logged-in user from the Spring Security authentication object.
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // Convert Client entity into ClientResponse DTO.
    private ClientResponse mapToResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getEmail(),
                client.getPhone(),
                client.getCompany(),
                client.getNotes(),
                client.getCreatedAt(),
                client.getUpdatedAt()
        );
    }
}
