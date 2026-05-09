package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.invoice.CreateInvoiceRequest;
import com.mekonnen.backend.dto.invoice.InvoiceResponse;
import com.mekonnen.backend.dto.invoice.UpdateInvoiceRequest;
import com.mekonnen.backend.entity.*;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.InvoiceRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final FeatureLimitService featureLimitService;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          UserRepository userRepository,
                          ClientRepository clientRepository,
                          ProjectRepository projectRepository,
                          FeatureLimitService featureLimitService
                          ) {
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
        this.featureLimitService = featureLimitService;
    }

    public InvoiceResponse create(CreateInvoiceRequest request, Authentication auth) {
        User user = getUser(auth);

        featureLimitService.checkInvoiceLimit(user);

        Client client = clientRepository.findByIdAndUser(request.getClientId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Project project = null;

        if (request.getProjectId() != null) {
            project = projectRepository.findByIdAndUser(request.getProjectId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        }

        Invoice invoice = new Invoice();
        invoice.setUser(user);
        invoice.setClient(client);
        invoice.setProject(project);
        invoice.setAmount(request.getAmount());
        invoice.setIssueDate(request.getIssueDate());
        invoice.setDueDate(request.getDueDate());

        return map(invoiceRepository.save(invoice));
    }

    public List<InvoiceResponse> getAll(Authentication auth) {
        User user = getUser(auth);

        return invoiceRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::map)
                .toList();
    }



    private User getUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private InvoiceResponse map(Invoice i) {
        return new InvoiceResponse(
                i.getId(),
                i.getAmount(),
                i.getStatus(),
                i.getIssueDate(),
                i.getDueDate(),
                i.getClient().getName(),
                i.getProject() != null ? i.getProject().getName() : null
        );
    }

    public InvoiceResponse updateStatus(Long id, InvoiceStatus status, Authentication auth) {
        User user = getUser(auth);

        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        if (!invoice.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Invoice not found");
        }

        invoice.setStatus(status);

        return map(invoiceRepository.save(invoice));
    }

    // Update an invoice owned by the logged-in user.
    public InvoiceResponse update(
            Long id,
            UpdateInvoiceRequest request,
            Authentication auth
    ) {
        User user = getUser(auth);

        Invoice invoice = invoiceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        Client client = clientRepository.findByIdAndUser(request.getClientId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Project project = null;

        if (request.getProjectId() != null) {
            project = projectRepository.findByIdAndUser(request.getProjectId(), user)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        }

        invoice.setClient(client);
        invoice.setProject(project);
        invoice.setAmount(request.getAmount());
        invoice.setStatus(request.getStatus());
        invoice.setIssueDate(request.getIssueDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setNotes(request.getNotes());

        Invoice updatedInvoice = invoiceRepository.save(invoice);

        return map(updatedInvoice);
    }

    // Delete an invoice owned by the logged-in user.
    public void delete(Long id, Authentication auth) {
        User user = getUser(auth);

        Invoice invoice = invoiceRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));

        invoiceRepository.delete(invoice);
    }
}
