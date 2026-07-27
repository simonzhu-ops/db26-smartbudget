package com.smartbudget.model;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseTransaction extends BaseTransaction {

    private String category;        // e.g. "Food", "Transport"

    public ExpenseTransaction(int txnId, BigDecimal amount,
                              LocalDate txnDate, String description) {
        this(txnId, amount, txnDate, description, null);
    }

    public ExpenseTransaction(int txnId, BigDecimal amount,
                              LocalDate txnDate, String description,
                              String category) {
        super(txnId, amount, txnDate, description);
        this.category = category;
    }

    @Override
    public String getType() {
        return "EXPENSE";
    }

    public String getCategory()              { return category; }
    public void setCategory(String category) { this.category = category; }

    @Override
    public String toString() {
        return super.toString() + (category != null ? " (" + category + ")" : "");
    }
}
