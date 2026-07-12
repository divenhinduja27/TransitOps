package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.DriverRequest;
import com.yadg.TransitOp.dto.DriverResponse;
import com.yadg.TransitOp.service.DriverService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // GET /api/drivers — All authenticated users can view drivers
    @GetMapping
    public ResponseEntity<List<DriverResponse>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    // GET /api/drivers/{id} — All authenticated users can view a driver
    @GetMapping("/{id}")
    public ResponseEntity<?> getDriverById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(driverService.getDriverById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/drivers/license/{licenseNumber} — All authenticated users
    @GetMapping("/license/{licenseNumber}")
    public ResponseEntity<?> getDriverByLicenseNumber(@PathVariable String licenseNumber) {
        try {
            return ResponseEntity.ok(driverService.getDriverByLicenseNumber(licenseNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/drivers/status/{status} — All authenticated users
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getDriversByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(driverService.getDriversByStatus(status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value. Allowed: AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED"));
        }
    }

    // POST /api/drivers — Only Fleet Manager can create drivers
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> createDriver(@RequestBody DriverRequest request) {
        try {
            DriverResponse created = driverService.createDriver(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/drivers/{id} — Fleet Manager or Safety Officer can update drivers
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_FLEET_MANAGER', 'ROLE_SAFETY_OFFICER')")
    public ResponseEntity<?> updateDriver(@PathVariable Long id, @RequestBody DriverRequest request) {
        try {
            DriverResponse updated = driverService.updateDriver(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/drivers/{id} — Only Fleet Manager can delete drivers
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> deleteDriver(@PathVariable Long id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok(Map.of("message", "Driver deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
