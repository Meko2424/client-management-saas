package com.mekonnen.backend.service;


import com.mekonnen.backend.dto.dashboard.DashboardSummaryResponse;
import com.mekonnen.backend.entity.ProjectStatus;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

// This service calculates dashboard metrics for the logged-in user.
@Service
public class DashboardService {

    private final ClientRepository clientRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public DashboardService(ClientRepository clientRepository,
                            ProjectRepository projectRepository,
                            UserRepository userRepository){
        this.clientRepository = clientRepository;
        this.projectRepository = projectRepository;
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

        return new DashboardSummaryResponse(
                totalClients,
                totalProjects,
                activeProjects,
                plannedProjects,
                completedProjects
        );
    }

    // Get the logged-in user from the JWT-authenticated email.
    private User getCurrentUser(Authentication authentication){
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
