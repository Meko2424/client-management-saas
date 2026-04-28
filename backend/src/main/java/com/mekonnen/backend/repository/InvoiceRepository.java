package com.mekonnen.backend.repository;

import com.mekonnen.backend.entity.Invoice;
import com.mekonnen.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserOrderByCreatedAtDesc(User user);
}
