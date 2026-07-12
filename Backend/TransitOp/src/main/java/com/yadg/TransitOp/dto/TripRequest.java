package com.yadg.TransitOp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripRequest {
    private String source;
    private String destination;
    private Long vehicleId;
    private Long driverId;
    private Double cargoWeight;
    private Double plannedDistance;
}
