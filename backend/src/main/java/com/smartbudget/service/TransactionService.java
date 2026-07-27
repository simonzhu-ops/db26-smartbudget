package com.smartbudget.service;

import com.smartbudget.model.BaseTransaction;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class TransactionService {

    private final List<BaseTransaction> transactions = new ArrayList<>();

    public void addTransaction(BaseTransaction t) {
        transactions.add(t);
    }

    /** Defensive copy — caller mutations don't leak into our state. */
    public List<BaseTransaction> getAll() {
        return new ArrayList<>(transactions);
    }

    /** Read-only alternative — fails fast on attempted mutation. */
    public List<BaseTransaction> getAllUnmodifiable() {
        return Collections.unmodifiableList(transactions);
    }

    public int size() {
        return transactions.size();
    }
}
