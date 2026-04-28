package com.mekonnen.backend.service;


import com.mekonnen.backend.dto.project.CreateProjectRequest;
import com.mekonnen.backend.dto.project.ProjectResponse;
import com.mekonnen.backend.entity.Client;
import com.mekonnen.backend.entity.Project;
import com.mekonnen.backend.entity.User;
import com.mekonnen.backend.exception.ResourceNotFoundException;
import com.mekonnen.backend.repository.ClientRepository;
import com.mekonnen.backend.repository.ProjectRepository;
import com.mekonnen.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;

    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          ClientRepository clientRepository){
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }



    public ProjectResponse createProject(CreateProjectRequest request, Authentication auth){
        User user = getUser(auth);

        Client client = clientRepository.findByIdAndUser(request.getClientId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        Project project = new Project();
        project.setUser(user);
        project.setClient(client);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setBudget(request.getBudget());
        project.setStartDate(request.getStartDate());
        project.setDueDate(request.getDueDate());

        return map(projectRepository.save(project));
    }

    public List<ProjectResponse> getProjects(Authentication auth) {
        User user = getUser(auth);

        return projectRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::map)
                .toList();
    }


    private User getUser(Authentication auth){
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProjectResponse map(Project p){
        return new ProjectResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getStatus(),
                p.getBudget(),
                p.getStartDate(),
                p.getDueDate(),
                p.getClient().getId(),
                p.getClient().getName()
        );
    }
}
