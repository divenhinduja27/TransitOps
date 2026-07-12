package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.FuelLogRequest;
import com.yadg.TransitOp.dto.FuelLogResponse;

import java.util.List;

public interface FuelLogService {
    FuelLogResponse addFuelLog(FuelLogRequest request);
    List<FuelLogResponse> getAllFuelLogs();
}
