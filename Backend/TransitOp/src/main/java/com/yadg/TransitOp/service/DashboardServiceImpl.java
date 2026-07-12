package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.DashboardKpis;
import com.yadg.TransitOp.entity.*;
import com.yadg.TransitOp.repository.DriverRepository;
import com.yadg.TransitOp.repository.TripRepository;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardServiceImpl(VehicleRepository vehicleRepository, DriverRepository driverRepository, TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardKpis getDashboardKpis(String vehicleType, String region) {
        // Fetch all vehicles
        List<Vehicle> vehicles = vehicleRepository.findAll();

        // Filter vehicles by type if provided
        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getType().equalsIgnoreCase(vehicleType.trim()))
                    .collect(Collectors.toList());
        }
        
        // Filter vehicles by region if provided
        if (region != null && !region.trim().isEmpty()) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getRegion() != null && v.getRegion().equalsIgnoreCase(region.trim()))
                    .collect(Collectors.toList());
        }

        // Calculate vehicle metrics
        long availableVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.AVAILABLE)
                .count();

        long activeVehicles = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.ON_TRIP)
                .count();

        long vehiclesInMaintenance = vehicles.stream()
                .filter(v -> v.getStatus() == VehicleStatus.IN_SHOP)
                .count();

        long totalActiveRegistry = vehicles.stream()
                .filter(v -> v.getStatus() != VehicleStatus.RETIRED)
                .count();

        double fleetUtilization = totalActiveRegistry > 0 
                ? ((double) activeVehicles / totalActiveRegistry) * 100 
                : 0.0;

        // Fetch all trips
        List<Trip> trips = tripRepository.findAll();

        // Filter trips based on the subset of matching vehicles
        if ((vehicleType != null && !vehicleType.trim().isEmpty()) || (region != null && !region.trim().isEmpty())) {
            List<Long> matchedVehicleIds = vehicles.stream().map(Vehicle::getId).collect(Collectors.toList());
            trips = trips.stream()
                    .filter(t -> matchedVehicleIds.contains(t.getVehicle().getId()))
                    .collect(Collectors.toList());
        }

        long activeTrips = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.DISPATCHED)
                .count();

        long pendingTrips = trips.stream()
                .filter(t -> t.getStatus() == TripStatus.DRAFT)
                .count();

        // Fetch all drivers and count drivers on duty (AVAILABLE or ON_TRIP)
        List<Driver> drivers = driverRepository.findAll();
        
        long driversOnDuty = drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE || d.getStatus() == DriverStatus.ON_TRIP)
                .count();

        return DashboardKpis.builder()
                .activeVehicles(activeVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesInMaintenance(vehiclesInMaintenance)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .driversOnDuty(driversOnDuty)
                .fleetUtilization(Math.round(fleetUtilization * 100.0) / 100.0)
                .build();
    }
}
