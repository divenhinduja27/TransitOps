package com.yadg.TransitOp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryResponse {
    private Double averageFuelEfficiency;
    private Double fleetUtilization;
    private BigDecimal totalOpex;
    private Double overallRoi;
    private BigDecimal fuelCost;
    private BigDecimal maintenanceCost;
    private BigDecimal tollCost;
    private BigDecimal miscCost;
    private List<VehiclePerformanceResponse> vehiclePerformance;
    private List<MonthlyTrendResponse> monthlyTrends;
}
