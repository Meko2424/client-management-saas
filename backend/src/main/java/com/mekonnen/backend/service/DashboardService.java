package com.mekonnen.backend.service;


import com.mekonnen.backend.dto.dashboard.DashboardSummaryResponse;
import com.mekonnen.backend.entity.Invoice;
import com.mekonnen.backend.entity.InvoiceStatus;
import com.mekonnen.backend.entity.ProjectStatus;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.InvoiceRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

// This service calculates dashboard metrics for the logged-in user.
@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final InvoiceRepository invoiceRepository;

    public DashboardService(ClientRepository clientRepository,
                            ProjectRepository projectRepository,
                            InvoiceRepository invoiceRepository,
                            UserRepository userRepository
                            ){
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;

    }

    // Build dashboard summary numbers for the currently logged-in user.
    public DashboardSummaryResponse getSummary(Authentication authentication){
        User user = getCurrentUser(authentication);

        long totalClients = clientRepository.countByUser(user);

        long totalProjects = projectRepository.countByUser(user);
        long activeProjects = projectRepository.countByUserAndStatus(user, ProjectStatus.ACTIVE);
        long plannedProjects = projectRepository.countByUserAndStatus(user, ProjectStatus.PLANNED);
        long completedProjects = projectRepository.countByUserAndStatus(user, ProjectStatus.COMPLETED);

        long totalInvoices = invoiceRepository.countByUser(user);
        long draftInvoices = invoiceRepository.countByUserAndStatus(user, InvoiceStatus.DRAFT);
        long sentInvoices = invoiceRepository.countByUserAndStatus(user, InvoiceStatus.SENT);
        long paidInvoices = invoiceRepository.countByUserAndStatus(user, InvoiceStatus.PAID);

        BigDecimal paidRevenue = calculateTotalAmount(
                invoiceRepository.findByUserAndStatus(user, InvoiceStatus.PAID)
        );

        BigDecimal outStandingRevenue = calculateTotalAmount(
                invoiceRepository.findByUserAndStatus(user, InvoiceStatus.SENT)
        );

        return new DashboardSummaryResponse(
                totalClients,
                totalProjects,
                activeProjects,
                plannedProjects,
                completedProjects,
                totalInvoices,
                draftInvoices,
                sentInvoices,
                paidInvoices,
                paidRevenue,
                outStandingRevenue
        );
    }

    private BigDecimal calculateTotalAmount(List<Invoice> invoices) {
        return invoices.stream()
                .map(Invoice::getAmount)
                .filter(amount -> amount != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get the logged-in user from the JWT-authenticated email.
    private User getCurrentUser(Authentication authentication){
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
