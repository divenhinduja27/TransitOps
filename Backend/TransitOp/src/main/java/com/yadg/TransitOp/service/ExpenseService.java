package com.yadg.TransitOp.service;

import com.yadg.TransitOp.dto.ExpenseRequest;
import com.yadg.TransitOp.dto.ExpenseResponse;

import java.util.List;

public interface ExpenseService {
    ExpenseResponse addExpense(ExpenseRequest request);
    List<ExpenseResponse> getAllExpenses();
}
