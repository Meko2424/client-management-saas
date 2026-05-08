package com.mekonnen.backend.controller;


import com.mekonnen.backend.dto.project.CreateProjectRequest;
import com.mekonnen.backend.dto.project.ProjectResponse;
import com.mekonnen.backend.dto.project.UpdateProjectRequest;
import com.mekonnen.backend.dto.project.UpdateProjectStatusRequest;
import com.mekonnen.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @PostMapping
    public ProjectResponse create(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication auth
    ) {
        return projectService.createProject(request, auth);
    }

    @GetMapping
    public List<ProjectResponse> getAll(Authentication auth) {
        return projectService.getProjects(auth);
    }

    @PatchMapping("/{id}/status")
    public ProjectResponse updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateProjectStatusRequest request,
            Authentication auth
    ){
        return projectService.updateStatus(id, request, auth);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProjectRequest request,
            Authentication auth
    ) {
        return projectService.updateProject(id, request, auth);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id,
            Authentication auth
    ) {
        projectService.deleteProject(id, auth);
    }
}
