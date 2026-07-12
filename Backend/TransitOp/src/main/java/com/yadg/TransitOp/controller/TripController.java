package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.CompleteTripRequest;
import com.yadg.TransitOp.dto.TripRequest;
import com.yadg.TransitOp.dto.TripResponse;
import com.yadg.TransitOp.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_FLEET_MANAGER', 'ROLE_DRIVER')")
    public ResponseEntity<?> createTrip(@RequestBody TripRequest request) {
        try {
            TripResponse created = tripService.createTrip(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/dispatch")
    @PreAuthorize("hasAnyAuthority('ROLE_FLEET_MANAGER', 'ROLE_DRIVER')")
    public ResponseEntity<?> dispatchTrip(@PathVariable Long id) {
        try {
            TripResponse dispatched = tripService.dispatchTrip(id);
            return ResponseEntity.ok(dispatched);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyAuthority('ROLE_FLEET_MANAGER', 'ROLE_DRIVER')")
    public ResponseEntity<?> completeTrip(@PathVariable Long id, @RequestBody CompleteTripRequest request) {
        try {
            TripResponse completed = tripService.completeTrip(id, request);
            return ResponseEntity.ok(completed);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('ROLE_FLEET_MANAGER', 'ROLE_DRIVER')")
    public ResponseEntity<?> cancelTrip(@PathVariable Long id) {
        try {
            TripResponse cancelled = tripService.cancelTrip(id);
            return ResponseEntity.ok(cancelled);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable Long id) {
        try {
            TripResponse trip = tripService.getTripById(id);
            return ResponseEntity.ok(trip);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
