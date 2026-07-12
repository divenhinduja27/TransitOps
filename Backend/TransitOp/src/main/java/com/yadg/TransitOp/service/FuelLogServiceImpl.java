package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.FuelLogRequest;
import com.yadg.TransitOp.dto.FuelLogResponse;
import com.yadg.TransitOp.entity.FuelLog;
import com.yadg.TransitOp.entity.Vehicle;
import com.yadg.TransitOp.repository.FuelLogRepository;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FuelLogServiceImpl implements FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;

    public FuelLogServiceImpl(FuelLogRepository fuelLogRepository, VehicleRepository vehicleRepository) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional
    public FuelLogResponse addFuelLog(FuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + request.getVehicleId()));

        // Odometer Synchronization logic
        if (request.getOdometer() != null && request.getOdometer() > vehicle.getOdometer()) {
            vehicle.setOdometer(request.getOdometer());
            vehicleRepository.save(vehicle);
        }

        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(request.getDate());
        } catch (DateTimeParseException | NullPointerException e) {
            parsedDate = LocalDate.now();
        }

        FuelLog fuelLog = FuelLog.builder()
                .vehicle(vehicle)
                .liters(request.getLiters())
                .cost(request.getCost())
                .logDate(parsedDate.atStartOfDay())
                .build();

        FuelLog saved = fuelLogRepository.save(fuelLog);
        return mapToResponse(saved, request.getOdometer() != null ? request.getOdometer() : vehicle.getOdometer());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponse> getAllFuelLogs() {
        return fuelLogRepository.findAll().stream()
                .map(f -> mapToResponse(f, f.getVehicle().getOdometer()))
                .collect(Collectors.toList());
    }

    private FuelLogResponse mapToResponse(FuelLog fuelLog, Double odometer) {
        return FuelLogResponse.builder()
                .id(fuelLog.getId())
                .vehicleId(fuelLog.getVehicle().getId())
                .vehicleRegistrationNumber(fuelLog.getVehicle().getRegistrationNumber())
                .liters(fuelLog.getLiters())
                .cost(fuelLog.getCost())
                .odometer(odometer)
                .date(fuelLog.getLogDate().toLocalDate().toString())
                .build();
    }
}
