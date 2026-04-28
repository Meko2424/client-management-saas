package com.mekonnen.backend.dto.project;


import com.mekonnen.backend.entity.ProjectStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProjectStatusRequest {

    @NotNull
    private ProjectStatus status;
}
