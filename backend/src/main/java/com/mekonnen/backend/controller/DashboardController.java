package com.mekonnen.backend.controller;


import com.mekonnen.backend.dto.dashboard.DashboardSummaryResponse;
import com.mekonnen.backend.service.DashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// This controller exposes dashboard analytics endpoints.
@RestController
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService){
        this.dashboardService = dashboardService;
    }

    // Return summary metrics for the logged-in user.
    @GetMapping("/api/dashboard/summary")
    public DashboardSummaryResponse getSummary(Authentication authentication){
        return  dashboardService.getSummary(authentication);
    }
}
