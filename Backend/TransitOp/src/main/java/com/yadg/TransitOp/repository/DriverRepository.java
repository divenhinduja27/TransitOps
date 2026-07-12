package com.yadg.TransitOp.repository;

import com.yadg.TransitOp.entity.Driver;
import com.yadg.TransitOp.entity.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(DriverStatus status);
}
