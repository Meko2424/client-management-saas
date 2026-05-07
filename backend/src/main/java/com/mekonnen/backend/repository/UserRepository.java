package com.mekonnen.backend.repository;


import com.mekonnen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//This repository lets us query the users table

public interface UserRepository extends JpaRepository<User, Long> {

    // Find by email address.
    Optional<User> findByEmail(String email);

    // Check whether an email already exists
    boolean existsByEmail(String email);

    Optional<User> findByStripeCustomerId(String stripeCustomerId);
}
