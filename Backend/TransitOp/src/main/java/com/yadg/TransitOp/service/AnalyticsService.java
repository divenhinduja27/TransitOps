package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.AnalyticsSummaryResponse;

public interface AnalyticsService {
    AnalyticsSummaryResponse getAnalyticsSummary(Long vehicleId, String vehicleType, String region, String startDate, String endDate, String tripStatus);
    byte[] exportPdf(Long vehicleId, String vehicleType, String region, String startDate, String endDate, String tripStatus);
    byte[] exportCsv(Long vehicleId, String vehicleType, String region, String startDate, String endDate, String tripStatus);
}
