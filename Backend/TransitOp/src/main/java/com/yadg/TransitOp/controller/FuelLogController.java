package com.yadg.TransitOp.controller;

import com.yadg.TransitOp.dto.FuelLogRequest;
import com.yadg.TransitOp.dto.FuelLogResponse;
import com.yadg.TransitOp.service.FuelLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fuel-logs")
public class FuelLogController {

    private final FuelLogService fuelLogService;

    public FuelLogController(FuelLogService fuelLogService) {
        this.fuelLogService = fuelLogService;
    }

    @PostMapping
    public ResponseEntity<?> addFuelLog(@RequestBody FuelLogRequest request) {
        try {
            FuelLogResponse created = fuelLogService.addFuelLog(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<FuelLogResponse>> getAllFuelLogs() {
        return ResponseEntity.ok(fuelLogService.getAllFuelLogs());
    }
}
