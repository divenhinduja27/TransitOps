package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.ExpenseRequest;
import com.yadg.TransitOp.dto.ExpenseResponse;
import com.yadg.TransitOp.entity.Expense;
import com.yadg.TransitOp.entity.ExpenseType;
import com.yadg.TransitOp.entity.Vehicle;
import com.yadg.TransitOp.repository.ExpenseRepository;
import com.yadg.TransitOp.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, VehicleRepository vehicleRepository) {
        this.expenseRepository = expenseRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional
    public ExpenseResponse addExpense(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + request.getVehicleId()));

        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(request.getDate());
        } catch (DateTimeParseException | NullPointerException e) {
            parsedDate = LocalDate.now();
        }

        ExpenseType type = mapStringToType(request.getType());

        Expense expense = Expense.builder()
                .vehicle(vehicle)
                .expenseType(type)
                .amount(request.getAmount())
                .description(request.getDescription())
                .expenseDate(parsedDate.atStartOfDay())
                .build();

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ExpenseType mapStringToType(String s) {
        if (s == null) return ExpenseType.OTHER;
        switch (s.trim()) {
            case "Toll Charges":
                return ExpenseType.TOLL;
            case "General Maintenance":
                return ExpenseType.MAINTENANCE;
            case "Driver Allowance":
                return ExpenseType.DRIVER_ALLOWANCE;
            case "State Permit Fee":
                return ExpenseType.STATE_PERMIT;
            case "Insurance Claim":
                return ExpenseType.INSURANCE;
            default:
                return ExpenseType.OTHER;
        }
    }

    private String mapTypeToString(ExpenseType type) {
        if (type == null) return "Other";
        switch (type) {
            case TOLL:
                return "Toll Charges";
            case MAINTENANCE:
                return "General Maintenance";
            case DRIVER_ALLOWANCE:
                return "Driver Allowance";
            case STATE_PERMIT:
                return "State Permit Fee";
            case INSURANCE:
                return "Insurance Claim";
            default:
                return "Other";
        }
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .vehicleId(expense.getVehicle().getId())
                .vehicleRegistrationNumber(expense.getVehicle().getRegistrationNumber())
                .type(mapTypeToString(expense.getExpenseType()))
                .amount(expense.getAmount())
                .date(expense.getExpenseDate().toLocalDate().toString())
                .description(expense.getDescription())
                .build();
    }
}
