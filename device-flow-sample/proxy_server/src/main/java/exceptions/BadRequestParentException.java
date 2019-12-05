package exceptions;

public class BadRequestParentException extends Exception {

    private String errorCode = null;
    private String errorMessage = null;
    private String subErrorCode = null;

//    public BadRequestParentExpectation(){
//        super();
//    }

    public BadRequestParentException(String message) {

        super(message);
    }

    public BadRequestParentException(Throwable cause) {

        super(cause);
    }

    public BadRequestParentException(String message, Throwable cause) {

        super(message, cause);
    }

    public BadRequestParentException(String message, String errorCode) {

        super(message);
        this.errorCode = errorCode;
    }

    public BadRequestParentException(String message, String errorCode, Throwable cause) {

        super(message, cause);
        this.errorCode = errorCode;
    }

    public BadRequestParentException(String message, String errorCode, String subErrorCode) {

        super(message);
        this.errorCode = errorCode;
        this.subErrorCode = subErrorCode;
    }

    public String getErrorCode() {

        return errorCode;
    }

    public String getErrorMessage() {

        return errorMessage;
    }

    public String getSubErrorCode() {

        return subErrorCode;
    }
}

