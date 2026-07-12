package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.DashboardKpis;
import com.yadg.TransitOp.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardKpis> getDashboardKpis(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region) {
        
        DashboardKpis kpis = dashboardService.getDashboardKpis(type, region);
        return ResponseEntity.ok(kpis);
    }
}
