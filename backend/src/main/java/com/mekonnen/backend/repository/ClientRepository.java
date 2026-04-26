package com.mekonnen.backend.repository;

import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// This repository gives us database access for clients.
public interface ClientRepository extends JpaRepository<Client, Long> {

    // Find all clients that belong to the logged-in user.
    List<Client> findByUserOrderByCreatedAtDesc(User user);

    // Find one client by ID, but only if it belongs to the logged-in user.
    Optional<Client> findByIdAndUser(Long id, User user);
}
