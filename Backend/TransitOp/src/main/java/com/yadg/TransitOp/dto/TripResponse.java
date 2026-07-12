package com.yadg.TransitOp.dto;

import com.yadg.TransitOp.entity.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripResponse {
    private Long id;
    private String source;
    private String destination;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private Long driverId;
    private String driverName;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double actualDistance;
    private Double fuelConsumed;
    private TripStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime dispatchedAt;
    private LocalDateTime completedAt;
}
