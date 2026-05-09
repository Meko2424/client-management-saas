package com.mekonnen.backend.repository;

import com.mekonnen.backend.entity.Invoice;
import com.mekonnen.backend.entity.InvoiceStatus;
import com.mekonnen.backend.entity.Project;
import com.mekonnen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserOrderByCreatedAtDesc(User user);

    long countByUser(User user);

    long countByUserAndStatus(User user, InvoiceStatus status);

    Optional<Invoice> findByIdAndUser(Long id, User user);

    List<Invoice> findByUserAndStatus(User user, InvoiceStatus status);
}
