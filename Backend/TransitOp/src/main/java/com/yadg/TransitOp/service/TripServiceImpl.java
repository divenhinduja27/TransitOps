package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.CompleteTripRequest;
import com.yadg.TransitOp.dto.TripRequest;
import com.yadg.TransitOp.dto.TripResponse;
import com.yadg.TransitOp.entity.*;
import com.yadg.TransitOp.repository.DriverRepository;
import com.yadg.TransitOp.repository.FuelLogRepository;
import com.yadg.TransitOp.repository.TripRepository;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final FuelLogRepository fuelLogRepository;

    public TripServiceImpl(TripRepository tripRepository, VehicleRepository vehicleRepository,
                           DriverRepository driverRepository, FuelLogRepository fuelLogRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.fuelLogRepository = fuelLogRepository;
    }

    @Override
    @Transactional
    public TripResponse createTrip(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + request.getVehicleId()));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + request.getDriverId()));

        // Validations
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Selected vehicle is not AVAILABLE. Current status: " + vehicle.getStatus());
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new RuntimeException("Selected driver is not AVAILABLE. Current status: " + driver.getStatus());
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Selected driver has an expired license! Expiry date: " + driver.getLicenseExpiryDate());
        }

        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            throw new RuntimeException("Selected driver is suspended!");
        }

        if (request.getCargoWeight() > vehicle.getMaxLoadCapacity()) {
            throw new RuntimeException("Cargo weight (" + request.getCargoWeight() 
                    + " kg) exceeds vehicle's maximum load capacity (" + vehicle.getMaxLoadCapacity() + " kg)");
        }

        Trip trip = Trip.builder()
                .source(request.getSource())
                .destination(request.getDestination())
                .vehicle(vehicle)
                .driver(driver)
                .cargoWeight(request.getCargoWeight())
                .plannedDistance(request.getPlannedDistance())
                .status(TripStatus.DRAFT)
                .build();

        Trip saved = tripRepository.save(trip);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TripResponse dispatchTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with ID: " + id));

        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT trips can be dispatched. Current status: " + trip.getStatus());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Vehicle registration " + vehicle.getRegistrationNumber() + " is not AVAILABLE.");
        }

        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new RuntimeException("Driver " + driver.getName() + " is not AVAILABLE.");
        }

        if (driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Driver " + driver.getName() + " has an expired license.");
        }

        // Transition statuses to ON_TRIP
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchedAt(LocalDateTime.now());
        Trip saved = tripRepository.save(trip);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TripResponse completeTrip(Long id, CompleteTripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with ID: " + id));

        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new RuntimeException("Only DISPATCHED trips can be completed. Current status: " + trip.getStatus());
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (request.getFinalOdometer() < vehicle.getOdometer()) {
            throw new RuntimeException("Final odometer reading (" + request.getFinalOdometer() 
                    + ") cannot be less than vehicle's current odometer (" + vehicle.getOdometer() + ")");
        }

        double actualDistance = request.getFinalOdometer() - vehicle.getOdometer();

        // Update vehicle odometer and status
        vehicle.setOdometer(request.getFinalOdometer());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        // Update driver status
        driver.setStatus(DriverStatus.AVAILABLE);
        driverRepository.save(driver);

        // Update trip details
        trip.setActualDistance(actualDistance);
        trip.setFuelConsumed(request.getFuelConsumed());
        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(LocalDateTime.now());
        Trip savedTrip = tripRepository.save(trip);

        // Record Fuel Log if cost/liters provided
        if (request.getFuelCost() != null && request.getFuelConsumed() > 0) {
            FuelLog fuelLog = FuelLog.builder()
                    .vehicle(vehicle)
                    .trip(savedTrip)
                    .liters(request.getFuelConsumed())
                    .cost(request.getFuelCost())
                    .logDate(LocalDateTime.now())
                    .build();
            fuelLogRepository.save(fuelLog);
        }

        return mapToResponse(savedTrip);
    }

    @Override
    @Transactional
    public TripResponse cancelTrip(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with ID: " + id));

        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel a trip that is already: " + trip.getStatus());
        }

        // If dispatched, restore vehicle and driver status
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.CANCELLED);
        Trip saved = tripRepository.save(trip);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with ID: " + id));
        return mapToResponse(trip);
    }

    private TripResponse mapToResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .source(trip.getSource())
                .destination(trip.getDestination())
                .vehicleId(trip.getVehicle().getId())
                .vehicleRegistrationNumber(trip.getVehicle().getRegistrationNumber())
                .driverId(trip.getDriver().getId())
                .driverName(trip.getDriver().getName())
                .cargoWeight(trip.getCargoWeight())
                .plannedDistance(trip.getPlannedDistance())
                .actualDistance(trip.getActualDistance())
                .fuelConsumed(trip.getFuelConsumed())
                .status(trip.getStatus())
                .createdAt(trip.getCreatedAt())
                .dispatchedAt(trip.getDispatchedAt())
                .completedAt(trip.getCompletedAt())
                .build();
    }
}
