package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.DashboardKpis;

public interface DashboardService {
    DashboardKpis getDashboardKpis(String vehicleType, String region);
}
