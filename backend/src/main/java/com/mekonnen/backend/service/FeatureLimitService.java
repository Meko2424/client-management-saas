package com.mekonnen.backend.service;

import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.PlanLimitExceededException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.InvoiceRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

// This service centralizes FREE vs PRO feature-limit rules
@Service
public class FeatureLimitService {

    private static final int FREE_CLIENT_LIMIT = 3;
    private static final int FREE_PROJECT_LIMIT = 3;
    private static final int FREE_INVOICE_LIMIT = 3;

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final InvoiceRepository invoiceRepository;

    public FeatureLimitService(
            ClientRepository clientRepository,
            ProjectRepository projectRepository,
            InvoiceRepository invoiceRepository
    ) {
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
        this.invoiceRepository = invoiceRepository;
    }

    // Check whether user can create another client.
    public void checkClientLimit(User user) {
        if (isPro(user)) {
            return;
        }

        long currentClients = clientRepository.countByUser(user);

        if (currentClients >= FREE_CLIENT_LIMIT) {
            throw new PlanLimitExceededException(
                    "Free plan limit reached. Upgrade to PRO to add more clients."
            );
        }
    }

    // Check whether user can create another project.
    public void checkProjectLimit(User user) {
        if (isPro(user)) {
            return;
        }

        long currentProjects = projectRepository.countByUser(user);

        if (currentProjects >= FREE_PROJECT_LIMIT) {
            throw new PlanLimitExceededException(
                    "Free plan limit reached. Upgrade to PRO to add more projects."
            );
        }
    }

    // Check whether user can create another invoice.
    public void checkInvoiceLimit(User user) {
        if (isPro(user)) {
            return;
        }

        long currentInvoices = invoiceRepository.countByUser(user);

        if (currentInvoices >= FREE_INVOICE_LIMIT) {
            throw new PlanLimitExceededException(
                    "Free plan limit reached. Upgrade to PRO to add more invoices."
            );
        }
    }

    // PRO users bypass all limits.
    private boolean isPro(User user) {
        return "PRO".equalsIgnoreCase(user.getSubscriptionPlan())
                && "ACTIVE".equalsIgnoreCase(user.getSubscriptionStatus());
    }
}
