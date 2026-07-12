package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.MaintenanceRequest;
import com.yadg.TransitOp.dto.MaintenanceResponse;

import java.util.List;

public interface MaintenanceService {
    MaintenanceResponse createMaintenanceLog(MaintenanceRequest request);
    MaintenanceResponse completeMaintenanceLog(Long id);
    List<MaintenanceResponse> getAllMaintenanceLogs();
    MaintenanceResponse getMaintenanceLogById(Long id);
    List<MaintenanceResponse> getMaintenanceLogsByVehicle(Long vehicleId);
    List<MaintenanceResponse> getMaintenanceLogsByStatus(String status);
}
