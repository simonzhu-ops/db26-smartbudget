package com.smartbudget.exception;
public class InvalidTransactionException extends RuntimeException {

    // -------------------------------------------------------
    // TODO TICKET-F024: Add a constructor
    // -------------------------------------------------------
    // WHAT: The constructor accepts an error message and passes it to the parent (RuntimeException).
    //
    // HOW:  Create a single public constructor that takes a String parameter called "message".
    //       Inside the constructor body, call super(message) to pass it up to RuntimeException.
    //       That's it — just one line inside the constructor.
    //
    // WHY:  super(message) stores the message so that getMessage() works later.
    //       When you catch this exception, you can call ex.getMessage() to see
    //       "Amount must be greater than zero" — very helpful for debugging.
    //
    // OBSERVE: After implementing, go to BaseTransaction and use it in the constructor validation.
    //          Then create a transaction with amount = -10. Your console should show:
    //          "InvalidTransactionException: Amount must be greater than zero"


    public InvalidTransactionException(String message) {
        super(message);
    }

    public InvalidTransactionException(String message, Throwable cause) {
        super(message, cause);
    }
}
