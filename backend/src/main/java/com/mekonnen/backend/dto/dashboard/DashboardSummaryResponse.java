package com.mekonnen.backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

// This DTO sends dashboard summary numbers to the frontend.
@Getter
@AllArgsConstructor
public class DashboardSummaryResponse {

    // Total clients owned by the logged-in user.
    private long totalClients;

    // Total projects owned by the logged-in user.
    private long totalProjects;

    // Number of active projects.
    private long activeProjects;

    // Number of planned projects.
    private long plannedProjects;

    // Number of completed projects.
    private long completedProjects;

    private long totalInvoices;
    private long draftInvoices;
    private long sentInvoices;
    private long paidInvoices;

    private BigDecimal paidRevenue;
    private BigDecimal outstandingRevenue;
}
