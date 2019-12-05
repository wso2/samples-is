package exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InternalServerError extends BadRequestParentException{

    public InternalServerError(String var1) {
        super(var1);

    }
}