package com.yadg.TransitOp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private String description;
    private LocalDateTime logDate;
    private BigDecimal cost;
    private String status;
    private LocalDateTime closedAt;
}
