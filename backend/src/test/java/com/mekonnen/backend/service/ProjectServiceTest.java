package com.mekonnen.backend.service;

import com.mekonnen.backend.dto.project.CreateProjectRequest;
import com.mekonnen.backend.dto.project.ProjectResponse;
import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.Project;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Test
    void createProject_shouldCreateProjectForLoggedInUserAndClient(){
        ProjectRepository projectRepository = mock(ProjectRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ClientRepository clientRepository = mock(ClientRepository.class);

        ProjectService projectService = new ProjectService(
                projectRepository,
                userRepository,
                clientRepository
        );

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        Client client = new Client();
        client.setId(10L);
        client.setName("Acme LLC");
        client.setUser(user);

        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Website Redesign");
        request.setClientId(10L);
        request.setBudget(new BigDecimal("2500.00"));

        Project savedProject = new Project();
        savedProject.setId(100L);
        savedProject.setUser(user);
        savedProject.setClient(client);
        savedProject.setName("Website Redesign");
        savedProject.setBudget(new BigDecimal("2500.00"));

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.findByIdAndUser(10L, user))
                .thenReturn(Optional.of(client));

        when(projectRepository.save(any(Project.class)))
                .thenReturn(savedProject);

        ProjectResponse response = projectService.createProject(request, authentication);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Website Redesign", response.getName());
        assertEquals(new BigDecimal("2500.00"), response.getBudget());
        assertEquals(10L, response.getClientId());
        assertEquals("Acme LLC", response.getClientName());

        verify(projectRepository, times(1)).save(any(Project.class));

    }

    @Test
    void createProject_shouldThrowExceptionWhenClientNotFound() {
        ProjectRepository projectRepository = mock(ProjectRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        ClientRepository clientRepository = mock(ClientRepository.class);

        ProjectService projectService = new ProjectService(
                projectRepository,
                userRepository,
                clientRepository
        );

        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        CreateProjectRequest request = new CreateProjectRequest();
        request.setName("Website Redesign");
        request.setClientId(999L);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(clientRepository.findByIdAndUser(999L, user))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> projectService.createProject(request, authentication)
        );

        verify(projectRepository, never()).save(any(Project.class));
    }
}
