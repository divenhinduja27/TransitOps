package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.DriverRequest;
import com.yadg.TransitOp.dto.DriverResponse;
import com.yadg.TransitOp.entity.Driver;
import com.yadg.TransitOp.entity.DriverStatus;
import com.yadg.TransitOp.entity.User;
import com.yadg.TransitOp.repository.DriverRepository;
import com.yadg.TransitOp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    public DriverService(DriverRepository driverRepository, UserRepository userRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }

    public List<DriverResponse> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DriverResponse getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        return mapToResponse(driver);
    }

    public DriverResponse getDriverByLicenseNumber(String licenseNumber) {
        Driver driver = driverRepository.findByLicenseNumber(licenseNumber)
                .orElseThrow(() -> new RuntimeException("Driver not found with license number: " + licenseNumber));
        return mapToResponse(driver);
    }

    public List<DriverResponse> getDriversByStatus(String status) {
        DriverStatus driverStatus = DriverStatus.valueOf(status.toUpperCase());
        return driverRepository.findByStatus(driverStatus).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DriverResponse createDriver(DriverRequest request) {
        if (driverRepository.findByLicenseNumber(request.getLicenseNumber()).isPresent()) {
            throw new RuntimeException("Driver with license number " + request.getLicenseNumber() + " already exists.");
        }

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        } else if (request.getUserEmail() != null && !request.getUserEmail().trim().isEmpty()) {
            user = userRepository.findByEmail(request.getUserEmail().trim())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getUserEmail()));
        }

        Driver driver = Driver.builder()
                .name(request.getName())
                .licenseNumber(request.getLicenseNumber())
                .licenseCategory(request.getLicenseCategory())
                .licenseExpiryDate(request.getLicenseExpiryDate())
                .contactNumber(request.getContactNumber())
                .safetyScore(request.getSafetyScore() != null ? request.getSafetyScore() : 100.0)
                .status(request.getStatus() != null ? DriverStatus.valueOf(request.getStatus().toUpperCase()) : DriverStatus.AVAILABLE)
                .user(user)
                .build();

        Driver saved = driverRepository.save(driver);
        return mapToResponse(saved);
    }

    public DriverResponse updateDriver(Long id, DriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));

        // Check for duplicate license number on a different driver
        driverRepository.findByLicenseNumber(request.getLicenseNumber())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Another driver with license number " + request.getLicenseNumber() + " already exists.");
                    }
                });

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));
        } else if (request.getUserEmail() != null && !request.getUserEmail().trim().isEmpty()) {
            user = userRepository.findByEmail(request.getUserEmail().trim())
                    .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getUserEmail()));
        }

        driver.setName(request.getName());
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setLicenseCategory(request.getLicenseCategory());
        driver.setLicenseExpiryDate(request.getLicenseExpiryDate());
        driver.setContactNumber(request.getContactNumber());
        driver.setSafetyScore(request.getSafetyScore() != null ? request.getSafetyScore() : driver.getSafetyScore());
        driver.setStatus(request.getStatus() != null ? DriverStatus.valueOf(request.getStatus().toUpperCase()) : driver.getStatus());
        driver.setUser(user);

        Driver updated = driverRepository.save(driver);
        return mapToResponse(updated);
    }

    public void deleteDriver(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driverRepository.delete(driver);
    }

    private DriverResponse mapToResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .licenseNumber(driver.getLicenseNumber())
                .licenseCategory(driver.getLicenseCategory())
                .licenseExpiryDate(driver.getLicenseExpiryDate())
                .contactNumber(driver.getContactNumber())
                .safetyScore(driver.getSafetyScore())
                .status(driver.getStatus().name())
                .userId(driver.getUser() != null ? driver.getUser().getId() : null)
                .userEmail(driver.getUser() != null ? driver.getUser().getEmail() : null)
                .build();
    }
}
