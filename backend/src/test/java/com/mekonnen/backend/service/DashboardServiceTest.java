package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.dashboard.DashboardSummaryResponse;
import com.mekonnen.backend.entity.Invoice;
import com.mekonnen.backend.entity.InvoiceStatus;
import com.mekonnen.backend.entity.ProjectStatus;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.InvoiceRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DashboardServiceTest {

    @Test
    void getSummary_shouldReturnDashboardCountsForLoggedInUser(){
        ClientRepository clientRepository = mock(ClientRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);
        InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        DashboardService service = new DashboardService(
                clientRepository,
                projectRepository,
                invoiceRepository,
                userRepository
        );

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Invoice paidInvoice = new Invoice();
        paidInvoice.setAmount(new BigDecimal("1500.00"));

        Invoice sentInvoice = new Invoice();
        sentInvoice.setAmount(new BigDecimal("800.00"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.countByUser(user))
                .thenReturn(5L);

        when(projectRepository.countByUser(user))
                .thenReturn(8L);

        when(projectRepository.countByUserAndStatus(user, ProjectStatus.ACTIVE))
                .thenReturn(3L);

        when(projectRepository.countByUserAndStatus(user, ProjectStatus.PLANNED))
                .thenReturn(4L);

        when(projectRepository.countByUserAndStatus(user, ProjectStatus.COMPLETED))
                .thenReturn(1L);

        when(invoiceRepository.countByUser(user))
                .thenReturn(6L);

        when(invoiceRepository.countByUserAndStatus(user, InvoiceStatus.DRAFT))
                .thenReturn(2L);

        when(invoiceRepository.countByUserAndStatus(user, InvoiceStatus.SENT))
                .thenReturn(3L);

        when(invoiceRepository.countByUserAndStatus(user, InvoiceStatus.PAID))
                .thenReturn(1L);

        when(invoiceRepository.findByUserAndStatus(user, InvoiceStatus.PAID))
                .thenReturn(List.of(paidInvoice));

        when(invoiceRepository.findByUserAndStatus(user, InvoiceStatus.SENT))
                .thenReturn(List.of(sentInvoice));

        DashboardSummaryResponse response = service.getSummary(auth);

        assertNotNull(response);
        assertEquals(5L, response.getTotalClients());
        assertEquals(8L, response.getTotalProjects());
        assertEquals(3L, response.getActiveProjects());
        assertEquals(4L, response.getPlannedProjects());
        assertEquals(1L, response.getCompletedProjects());

        assertEquals(6L, response.getTotalInvoices());
        assertEquals(2L, response.getDraftInvoices());
        assertEquals(3L, response.getSentInvoices());
        assertEquals(1L, response.getPaidInvoices());

        assertEquals(new BigDecimal("1500.00"), response.getPaidRevenue());
        assertEquals(new BigDecimal("800.00"), response.getOutstandingRevenue());

//        verify(clientRepository, times(1)).countByUser(user);
//        verify(projectRepository, times(1)).countByUser(user);
//        verify(projectRepository, times(1)).countByUserAndStatus(user, ProjectStatus.ACTIVE);
//        verify(projectRepository, times(1)).countByUserAndStatus(user, ProjectStatus.PLANNED);
//        verify(projectRepository, times(1)).countByUserAndStatus(user, ProjectStatus.COMPLETED);
    }

    @Test
    void getSummary_shouldThrowExceptionWhenUserNotFound() {
        ClientRepository clientRepository = mock(ClientRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);
        InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
        UserRepository userRepository = mock(UserRepository.class);

        DashboardService service = new DashboardService(
                clientRepository,
                projectRepository,
                invoiceRepository,
                userRepository
        );

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("missing@example.com");

        when(userRepository.findByEmail("missing@example.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.getSummary(auth)
        );

        verify(clientRepository, never()).countByUser(any());
        verify(projectRepository, never()).countByUser(any());
        verify(invoiceRepository, never()).countByUser(any());
    }
}
