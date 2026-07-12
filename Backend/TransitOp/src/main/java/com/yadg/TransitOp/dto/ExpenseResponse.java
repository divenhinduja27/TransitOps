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
public class ExpenseResponse {
    private Long id;
    private Long vehicleId;
    private String vehicleRegistrationNumber;
    private String type; // UI-friendly format (e.g. "Toll Charges")
    private BigDecimal amount;
    private String date; // Formatted YYYY-MM-DD
    private String description;
}
