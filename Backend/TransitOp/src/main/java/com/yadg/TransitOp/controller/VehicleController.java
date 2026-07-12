package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.VehicleRequest;
import com.yadg.TransitOp.dto.VehicleResponse;
import com.yadg.TransitOp.service.VehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    // GET /api/vehicles — All authenticated users can view vehicles
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // GET /api/vehicles/{id} — All authenticated users can view a vehicle
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(vehicleService.getVehicleById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/vehicles/registration/{regNumber} — All authenticated users
    @GetMapping("/registration/{regNumber}")
    public ResponseEntity<?> getVehicleByRegistration(@PathVariable String regNumber) {
        try {
            return ResponseEntity.ok(vehicleService.getVehicleByRegistration(regNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/vehicles/status/{status} — All authenticated users
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getVehiclesByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(vehicleService.getVehiclesByStatus(status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value. Allowed: AVAILABLE, ON_TRIP, IN_SHOP, RETIRED"));
        }
    }

    // POST /api/vehicles — Only Fleet Manager can create vehicles
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> createVehicle(@RequestBody VehicleRequest request) {
        try {
            VehicleResponse created = vehicleService.createVehicle(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/vehicles/{id} — Only Fleet Manager can update vehicles
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> updateVehicle(@PathVariable Long id, @RequestBody VehicleRequest request) {
        try {
            VehicleResponse updated = vehicleService.updateVehicle(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /api/vehicles/{id} — Only Fleet Manager can delete vehicles
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Long id) {
        try {
            vehicleService.deleteVehicle(id);
            return ResponseEntity.ok(Map.of("message", "Vehicle deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
