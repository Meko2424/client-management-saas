package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.invoice.CreateInvoiceRequest;
import com.mekonnen.backend.dto.invoice.InvoiceResponse;
import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.Invoice;
import com.mekonnen.backend.entity.Project;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.InvoiceRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class InvoiceServiceTest {

    @Test
    void createInvoice_shouldCreateInvoiceWithProject(){

        InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ClientRepository clientRepository = mock(ClientRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);

        InvoiceService service = new InvoiceService(
                invoiceRepository,
                userRepository,
                clientRepository,
                projectRepository
        );

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Client client = new Client();
        client.setId(10L);
        client.setName("Acme");
        client.setUser(user);

        Project project = new Project();
        project.setId(20L);
        project.setName("Website");
        project.setUser(user);

        CreateInvoiceRequest request = new CreateInvoiceRequest();
        request.setClientId(10L);
        request.setProjectId(20L);
        request.setAmount(new BigDecimal("1500.00"));

        Invoice saved = new Invoice();
        saved.setId(100L);
        saved.setUser(user);
        saved.setClient(client);
        saved.setProject(project);
        saved.setAmount(new BigDecimal("1500.00"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(client));

        when(projectRepository.findByIdAndUser(20L, user))
                .thenReturn(Optional.of(project));

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(saved);

        InvoiceResponse response = service.create(request, auth);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(new BigDecimal("1500.00"), response.getAmount());
        assertEquals("Acme", response.getClientName());
        assertEquals("Website", response.getProjectName());

        verify(invoiceRepository, times(1)).save(any(Invoice.class));
    }

    @Test
    void createInvoice_shouldCreateWithoutProject() {
        InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ClientRepository clientRepository = mock(ClientRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);

        InvoiceService service = new InvoiceService(
                invoiceRepository,
                userRepository,
                clientRepository,
                projectRepository
        );

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Client client = new Client();
        client.setId(10L);
        client.setName("Acme");
        client.setUser(user);

        CreateInvoiceRequest request = new CreateInvoiceRequest();
        request.setClientId(10L);
        request.setAmount(new BigDecimal("800.00"));

        Invoice saved = new Invoice();
        saved.setId(200L);
        saved.setUser(user);
        saved.setClient(client);
        saved.setAmount(new BigDecimal("800.00"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(client));

        when(invoiceRepository.save(any(Invoice.class)))
                .thenReturn(saved);

        InvoiceResponse response = service.create(request, auth);

        assertNotNull(response);
        assertEquals(200L, response.getId());
        assertEquals("Acme", response.getClientName());
        assertNull(response.getProjectName());

        verify(invoiceRepository, times(1)).save(any(Invoice.class));
    }

    @Test
    void createInvoice_shouldFailWhenClientNotFound() {
        InvoiceRepository invoiceRepository = mock(InvoiceRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ClientRepository clientRepository = mock(ClientRepository.class);
        ProjectRepository projectRepository = mock(ProjectRepository.class);

        InvoiceService service = new InvoiceService(
                invoiceRepository,
                userRepository,
                clientRepository,
                projectRepository
        );

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setEmail("test@example.com");

        CreateInvoiceRequest request = new CreateInvoiceRequest();
        request.setClientId(999L);
        request.setAmount(new BigDecimal("1000"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.findByIdAndUser(999L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> service.create(request, auth)
        );

        verify(invoiceRepository, never()).save(any());
    }
}
