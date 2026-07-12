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
public class FuelLogResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private Double liters;
    private BigDecimal cost;
    private Double odometer;
    private String date; // Formatted YYYY-MM-DD
}
