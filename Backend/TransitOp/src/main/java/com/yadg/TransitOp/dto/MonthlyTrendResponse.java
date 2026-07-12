package com.yadg.TransitOp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTrendResponse {
    private String month;
    private BigDecimal revenue;
    private BigDecimal opex;
    private BigDecimal profit;
    private Double fuelEfficiency;
    private Double utilization;
}
