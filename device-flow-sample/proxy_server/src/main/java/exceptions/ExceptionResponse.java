package exceptions;

public class ExceptionResponse {

    private String error;
    private String errorDescription;

    public String getError() {
        return error;
    }

    public void setErrorMessage(final String error) {
        this.error = error;
    }

    public String getError_description() {
        return errorDescription;
    }

    public void setErrorDescription(final String errorDescription) {
        this.errorDescription = errorDescription;
    }
}
