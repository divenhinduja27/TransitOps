package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.VehicleRequest;
import com.yadg.TransitOp.dto.VehicleResponse;
import com.yadg.TransitOp.entity.Vehicle;
import com.yadg.TransitOp.entity.VehicleStatus;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        return mapToResponse(vehicle);
    }

    public VehicleResponse getVehicleByRegistration(String registrationNumber) {
        Vehicle vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with registration: " + registrationNumber));
        return mapToResponse(vehicle);
    }

    public List<VehicleResponse> getVehiclesByStatus(String status) {
        VehicleStatus vehicleStatus = VehicleStatus.valueOf(status.toUpperCase());
        return vehicleRepository.findByStatus(vehicleStatus).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VehicleResponse createVehicle(VehicleRequest request) {
        if (vehicleRepository.findByRegistrationNumber(request.getRegistrationNumber()).isPresent()) {
            throw new RuntimeException("Vehicle with registration number " + request.getRegistrationNumber() + " already exists.");
        }

        Vehicle vehicle = Vehicle.builder()
                .registrationNumber(request.getRegistrationNumber())
                .model(request.getModel())
                .type(request.getType())
                .maxLoadCapacity(request.getMaxLoadCapacity())
                .odometer(request.getOdometer())
                .acquisitionCost(request.getAcquisitionCost())
                .status(request.getStatus() != null ? VehicleStatus.valueOf(request.getStatus().toUpperCase()) : VehicleStatus.AVAILABLE)
                .region(request.getRegion())
                .build();

        Vehicle saved = vehicleRepository.save(vehicle);
        return mapToResponse(saved);
    }

    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        // Check for duplicate registration number on a different vehicle
        vehicleRepository.findByRegistrationNumber(request.getRegistrationNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Another vehicle with registration number " + request.getRegistrationNumber() + " already exists.");
                    }
                });

        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setModel(request.getModel());
        vehicle.setType(request.getType());
        vehicle.setMaxLoadCapacity(request.getMaxLoadCapacity());
        vehicle.setOdometer(request.getOdometer());
        vehicle.setAcquisitionCost(request.getAcquisitionCost());
        vehicle.setStatus(request.getStatus() != null ? VehicleStatus.valueOf(request.getStatus().toUpperCase()) : vehicle.getStatus());
        vehicle.setRegion(request.getRegion());

        Vehicle updated = vehicleRepository.save(vehicle);
        return mapToResponse(updated);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .registrationNumber(vehicle.getRegistrationNumber())
                .model(vehicle.getModel())
                .type(vehicle.getType())
                .maxLoadCapacity(vehicle.getMaxLoadCapacity())
                .odometer(vehicle.getOdometer())
                .acquisitionCost(vehicle.getAcquisitionCost())
                .status(vehicle.getStatus().name())
                .region(vehicle.getRegion())
                .build();
    }
}
