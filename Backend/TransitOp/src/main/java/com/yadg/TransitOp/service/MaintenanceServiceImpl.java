package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.MaintenanceRequest;
import com.yadg.TransitOp.dto.MaintenanceResponse;
import com.yadg.TransitOp.entity.MaintenanceLog;
import com.yadg.TransitOp.entity.MaintenanceStatus;
import com.yadg.TransitOp.entity.Vehicle;
import com.yadg.TransitOp.entity.VehicleStatus;
import com.yadg.TransitOp.repository.MaintenanceLogRepository;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceServiceImpl(MaintenanceLogRepository maintenanceLogRepository,
                                  VehicleRepository vehicleRepository) {
        this.maintenanceLogRepository = maintenanceLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional
    public MaintenanceResponse createMaintenanceLog(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + request.getVehicleId()));

        // Prevent creating maintenance for a vehicle already in shop
        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new RuntimeException("Vehicle " + vehicle.getRegistrationNumber()
                    + " is already IN_SHOP. Complete the existing maintenance before creating a new one.");
        }

        // Prevent creating maintenance for a vehicle currently on a trip
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new RuntimeException("Vehicle " + vehicle.getRegistrationNumber()
                    + " is currently ON_TRIP. Cannot send to maintenance until the trip is completed or cancelled.");
        }

        // Create maintenance log with ACTIVE status
        MaintenanceLog log = MaintenanceLog.builder()
                .vehicle(vehicle)
                .description(request.getDescription())
                .logDate(LocalDateTime.now())
                .cost(request.getCost())
                .status(MaintenanceStatus.ACTIVE)
                .build();

        MaintenanceLog saved = maintenanceLogRepository.save(log);

        // Auto-switch vehicle status to IN_SHOP
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public MaintenanceResponse completeMaintenanceLog(Long id) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found with ID: " + id));

        if (log.getStatus() != MaintenanceStatus.ACTIVE) {
            throw new RuntimeException("Only ACTIVE maintenance logs can be completed. Current status: " + log.getStatus());
        }

        // Complete the maintenance log
        log.setStatus(MaintenanceStatus.COMPLETED);
        log.setClosedAt(LocalDateTime.now());
        MaintenanceLog saved = maintenanceLogRepository.save(log);

        // Auto-switch vehicle status back to AVAILABLE
        Vehicle vehicle = log.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getAllMaintenanceLogs() {
        return maintenanceLogRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponse getMaintenanceLogById(Long id) {
        MaintenanceLog log = maintenanceLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance log not found with ID: " + id));
        return mapToResponse(log);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getMaintenanceLogsByVehicle(Long vehicleId) {
        // Validate vehicle exists
        vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + vehicleId));

        return maintenanceLogRepository.findByVehicleId(vehicleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> getMaintenanceLogsByStatus(String status) {
        MaintenanceStatus maintenanceStatus = MaintenanceStatus.valueOf(status.toUpperCase());
        return maintenanceLogRepository.findByStatus(maintenanceStatus).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MaintenanceResponse mapToResponse(MaintenanceLog log) {
        return MaintenanceResponse.builder()
                .id(log.getId())
                .vehicleId(log.getVehicle().getId())
                .vehicleRegistrationNumber(log.getVehicle().getRegistrationNumber())
                .description(log.getDescription())
                .logDate(log.getLogDate())
                .cost(log.getCost())
                .status(log.getStatus().name())
                .closedAt(log.getClosedAt())
                .build();
    }
}
