package com.yadg.TransitOp.repository;

import com.yadg.TransitOp.entity.MaintenanceLog;
import com.yadg.TransitOp.entity.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
    List<MaintenanceLog> findByVehicleId(Long vehicleId);
    List<MaintenanceLog> findByStatus(MaintenanceStatus status);
    List<MaintenanceLog> findByVehicleIdAndStatus(Long vehicleId, MaintenanceStatus status);
}
