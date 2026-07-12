package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.MaintenanceRequest;
import com.yadg.TransitOp.dto.MaintenanceResponse;
import com.yadg.TransitOp.service.MaintenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    // POST /api/maintenance — Create maintenance log (vehicle → IN_SHOP)
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> createMaintenanceLog(@RequestBody MaintenanceRequest request) {
        try {
            MaintenanceResponse created = maintenanceService.createMaintenanceLog(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/maintenance/{id}/complete — Complete maintenance (vehicle → AVAILABLE)
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> completeMaintenanceLog(@PathVariable Long id) {
        try {
            MaintenanceResponse completed = maintenanceService.completeMaintenanceLog(id);
            return ResponseEntity.ok(completed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/maintenance — List all maintenance logs
    @GetMapping
    public ResponseEntity<List<MaintenanceResponse>> getAllMaintenanceLogs() {
        return ResponseEntity.ok(maintenanceService.getAllMaintenanceLogs());
    }

    // GET /api/maintenance/{id} — Get maintenance log by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMaintenanceLogById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(maintenanceService.getMaintenanceLogById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/maintenance/vehicle/{vehicleId} — Get maintenance history for a vehicle
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<?> getMaintenanceLogsByVehicle(@PathVariable Long vehicleId) {
        try {
            return ResponseEntity.ok(maintenanceService.getMaintenanceLogsByVehicle(vehicleId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/maintenance/status/{status} — Filter by ACTIVE/COMPLETED
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getMaintenanceLogsByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(maintenanceService.getMaintenanceLogsByStatus(status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status. Allowed: ACTIVE, COMPLETED"));
        }
    }
}
