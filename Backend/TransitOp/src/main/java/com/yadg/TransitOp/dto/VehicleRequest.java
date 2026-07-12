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
public class VehicleRequest {
    private String registrationNumber;
    private String model;
    private String type;
    private Double maxLoadCapacity;
    private Double odometer;
    private BigDecimal acquisitionCost;
    private String status;
    private String region;
}
