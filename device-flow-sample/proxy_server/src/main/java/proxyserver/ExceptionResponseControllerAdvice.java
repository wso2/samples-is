package proxyserver;

import exceptions.*;
import exceptions.tokenerrors.AuthorizationPending;
import exceptions.tokenerrors.SlowDown;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ExceptionResponseControllerAdvice extends ResponseEntityExceptionHandler {

    public ExceptionResponseControllerAdvice() {

        super();
    }

    @ExceptionHandler(BadRequest.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody
    ExceptionResponse handleBadRequest() {

        ExceptionResponse error = new ExceptionResponse();
        error.setErrorMessage("invalid request");
        error.setErrorDescription("requested parameter is missing");

        return error;
    }

    @ExceptionHandler(Unauthorized.class)
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public @ResponseBody
    ExceptionResponse handleUnauthorized() {

        ExceptionResponse error = new ExceptionResponse();
        error.setErrorMessage("invalid client");
        error.setErrorDescription("requested parameter is wrong");

        return error;
    }

    @ExceptionHandler(Expired.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody
    ExceptionResponse handleExpired() {

        ExceptionResponse error = new ExceptionResponse();
        error.setErrorMessage("invalid request");
        error.setErrorDescription("device code expired");

        return error;
    }

    @ExceptionHandler(AuthorizationPending.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody
    ExceptionResponse handleAuthorizationPending() {

        ExceptionResponse error = new ExceptionResponse();
        error.setErrorMessage("Authorization Pending");
        error.setErrorDescription("Authorization is still pending");

        return error;
    }

    @ExceptionHandler(SlowDown.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    public @ResponseBody
    ExceptionResponse handleSlowDown() {

        ExceptionResponse error = new ExceptionResponse();
        error.setErrorMessage("Slow Down");
        error.setErrorDescription("Increase Interval by 5");

        return error;
    }

}
