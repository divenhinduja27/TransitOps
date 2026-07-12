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
public class ExpenseRequest {
    private Long vehicleId;
    private String type; // e.g. "Toll Charges", "Driver Allowance", etc.
    private BigDecimal amount;
    private String date; // Expected format: YYYY-MM-DD
    private String description;
}
